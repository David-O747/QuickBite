const express = require('express')
const crypto = require('crypto')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const { hashPassword, verifyPassword } = require('./authPassword')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173'

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null

const transitionTimers = new Map()

app.use(
  cors({
    origin: FRONTEND_ORIGIN.split(',').map((value) => value.trim()),
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))

function randomSupportPhone() {
  return `07${Math.floor(100000000 + Math.random() * 900000000)}`
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizeUsername(username) {
  return String(username || '').trim()
}

function toCustomerResponse(record) {
  return {
    id: record.id,
    customerEmail: record.email,
    customerUsername: record.username,
  }
}

function authSetupError() {
  return 'Account database is not set up. In Supabase SQL Editor, run supabase/setup_all.sql, then confirm the customers table exists.'
}

function isMissingCustomersTable(error) {
  const message = String(error?.message || '')
  const code = String(error?.code || '')
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    message.includes("Could not find the table 'public.customers'") ||
    message.includes('relation "public.customers" does not exist') ||
    message.toLowerCase().includes('could not find the table')
  )
}

function isPermissionDenied(error) {
  const message = String(error?.message || '').toLowerCase()
  const code = String(error?.code || '')
  return (
    code === '42501' ||
    message.includes('permission denied') ||
    message.includes('row-level security') ||
    message.includes('rls')
  )
}

function describeAuthDbError(error, fallback) {
  if (!error) return fallback
  if (isMissingCustomersTable(error)) return authSetupError()
  if (isPermissionDenied(error)) {
    return 'Database permission denied. On Render, SUPABASE_SERVICE_ROLE_KEY must be the service_role secret key (not the anon key).'
  }
  const detail = [error.code, error.message].filter(Boolean).join(': ')
  return detail ? `${fallback} (${detail})` : fallback
}

app.post('/api/auth/register', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Authentication service is not configured' })
    }

    const email = normalizeEmail(req.body.email)
    const username = normalizeUsername(req.body.username)
    const password = String(req.body.password || '')

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address' })
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' })
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password) || password.length < 8) {
      return res.status(400).json({
        error: 'Password needs 1 letter, 1 number, and 8+ characters',
      })
    }

    const { data: existingByEmail } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingByEmail) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please log in instead.',
      })
    }

    const { data: existingByUsername } = await supabase
      .from('customers')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (existingByUsername) {
      return res.status(409).json({ error: 'This username is already taken.' })
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        email,
        username,
        password_hash: hashPassword(password),
      })
      .select('id, email, username')
      .single()

    if (error || !customer) {
      console.error('register customers insert failed', error)
      return res.status(500).json({ error: describeAuthDbError(error, 'Could not create account') })
    }

    await supabase.from('customer_profiles').insert({ customer_id: customer.id })

    res.status(201).json({
      success: true,
      customer: toCustomerResponse(customer),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unexpected error creating account' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Authentication service is not configured' })
    }

    const email = normalizeEmail(req.body.email)
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, email, username, password_hash')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      console.error('login customers select failed', error)
      return res.status(500).json({ error: describeAuthDbError(error, 'Could not verify account') })
    }

    if (!customer) {
      return res.status(401).json({
        error: 'No account found with this email. Please register first.',
      })
    }

    if (!verifyPassword(password, customer.password_hash)) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' })
    }

    res.json({
      success: true,
      customer: toCustomerResponse(customer),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unexpected error signing in' })
  }
})

function toProfileResponse(row) {
  return {
    savedPostcode: row.saved_postcode || '',
    deliveryDetails: {
      fullName: row.delivery_full_name || '',
      streetAddress: row.delivery_street || '',
      city: row.delivery_city || '',
      postcode: row.delivery_postcode || '',
      phoneNumber: row.delivery_phone || '',
    },
    favoriteRestaurantIds: Array.isArray(row.favorite_restaurant_ids)
      ? row.favorite_restaurant_ids
      : [],
    cookiePreferences: {
      essential: true,
      preferences: row.cookie_preferences !== false,
      study: row.cookie_study !== false,
    },
  }
}

function mapOrderForClient(order, items = []) {
  return {
    orderNumber: order.order_number,
    orderItems: (items || []).map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      productDescription: item.product_description || '',
      imagePath: item.image_path || '',
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      restaurantId: item.product_id,
      restaurantName: order.restaurant_name,
    })),
    restaurantName: order.restaurant_name,
    orderSubtotal: Number(order.subtotal),
    deliveryFee: Number(order.delivery_fee),
    serviceFee: Number(order.service_fee),
    promoDiscount: Number(order.promo_discount),
    promoCode: order.promo_code || '',
    orderTotal: Number(order.total),
    estimatedArrival: order.estimated_arrival_label || '8-12 minutes',
    backendOrderId: order.id,
    trackingPublicId: order.tracking_public_id,
    supportPhone: order.support_phone || '',
    backendStatus: order.status || 'confirmed',
    deliveryDetails: {
      fullName: order.delivery_full_name || '',
      streetAddress: order.delivery_street || '',
      city: order.delivery_city || '',
      postcode: order.delivery_postcode || '',
      phoneNumber: order.delivery_phone || '',
    },
    contactEmail: order.contact_email || '',
    contactPhone: order.contact_phone || '',
    placedAt: order.created_at,
  }
}

async function ensureCustomerProfile(customerId) {
  const { data: existing } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle()

  if (existing) return existing

  const { data: created, error } = await supabase
    .from('customer_profiles')
    .insert({ customer_id: customerId })
    .select('*')
    .single()

  if (error) throw error
  return created
}

app.get('/api/customers/:customerId/profile', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase backend is not configured' })
    }

    const profile = await ensureCustomerProfile(req.params.customerId)
    res.json({ profile: toProfileResponse(profile) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load profile' })
  }
})

app.put('/api/customers/:customerId/profile', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase backend is not configured' })
    }

    const customerId = req.params.customerId
    await ensureCustomerProfile(customerId)

    const body = req.body || {}
    const delivery = body.deliveryDetails || {}
    const cookies = body.cookiePreferences || {}

    const updates = {
      updated_at: new Date().toISOString(),
    }

    if (body.savedPostcode !== undefined) updates.saved_postcode = body.savedPostcode
    if (delivery.fullName !== undefined) updates.delivery_full_name = delivery.fullName
    if (delivery.streetAddress !== undefined) updates.delivery_street = delivery.streetAddress
    if (delivery.city !== undefined) updates.delivery_city = delivery.city
    if (delivery.postcode !== undefined) updates.delivery_postcode = delivery.postcode
    if (delivery.phoneNumber !== undefined) updates.delivery_phone = delivery.phoneNumber
    if (body.favoriteRestaurantIds !== undefined) {
      updates.favorite_restaurant_ids = body.favoriteRestaurantIds
    }
    if (cookies.preferences !== undefined) updates.cookie_preferences = Boolean(cookies.preferences)
    if (cookies.study !== undefined) updates.cookie_study = Boolean(cookies.study)

    const { data: profile, error } = await supabase
      .from('customer_profiles')
      .update(updates)
      .eq('customer_id', customerId)
      .select('*')
      .single()

    if (error || !profile) {
      return res.status(500).json({ error: 'Could not save profile' })
    }

    res.json({ success: true, profile: toProfileResponse(profile) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not save profile' })
  }
})

app.get('/api/customers/:customerId/orders', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase backend is not configured' })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', req.params.customerId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return res.status(500).json({ error: 'Could not load orders' })
    }

    const orderList = orders || []
    const orderIds = orderList.map((order) => order.id)
    let itemsByOrder = {}

    if (orderIds.length > 0) {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds)

      itemsByOrder = (items || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = []
        acc[item.order_id].push(item)
        return acc
      }, {})
    }

    res.json({
      orders: orderList.map((order) => mapOrderForClient(order, itemsByOrder[order.id] || [])),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load orders' })
  }
})

app.post('/api/support/messages', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase backend is not configured' })
    }

    const name = String(req.body.name || '').trim()
    const email = normalizeEmail(req.body.email)
    const message = String(req.body.message || '').trim()
    const customerId = req.body.customer_id || null

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const { error } = await supabase.from('support_messages').insert({
      customer_id: customerId,
      name,
      email,
      message,
    })

    if (error) {
      return res.status(500).json({ error: 'Could not save message' })
    }

    res.status(201).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unexpected error saving message' })
  }
})

async function logNotification(orderId, channel, target, messageBody, status = 'queued') {
  if (!supabase) return
  await supabase.from('order_notifications').insert({
    order_id: orderId,
    channel,
    target,
    message_body: messageBody,
    provider_status: status,
    sent_at: new Date().toISOString(),
  })
}

async function sendEmail({ to, subject, text }) {
  if (!to) return { status: 'skipped', reason: 'missing email' }
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    return { status: 'mocked', reason: 'sendgrid keys missing' }
  }
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail },
      subject,
      content: [{ type: 'text/plain', value: text }],
    }),
  })
  return {
    status: response.ok ? 'sent' : 'failed',
    reason: response.ok ? '' : `sendgrid ${response.status}`,
  }
}

async function sendSms({ to, body }) {
  if (!to) return { status: 'skipped', reason: 'missing phone' }
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) {
    return { status: 'mocked', reason: 'twilio keys missing' }
  }

  const params = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  })
  const basicAuth = Buffer.from(`${sid}:${token}`).toString('base64')
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })
  return {
    status: response.ok ? 'sent' : 'failed',
    reason: response.ok ? '' : `twilio ${response.status}`,
  }
}

async function notifyOrderUpdate(orderRecord, updateText) {
  const emailResult = await sendEmail({
    to: orderRecord.contact_email,
    subject: `QuickBite order ${orderRecord.order_number}: ${updateText}`,
    text: `Order ${orderRecord.order_number} update: ${updateText}`,
  })
  await logNotification(
    orderRecord.id,
    'email',
    orderRecord.contact_email || '',
    `Order ${orderRecord.order_number} update: ${updateText}`,
    emailResult.status
  )

  const smsResult = await sendSms({
    to: orderRecord.contact_phone,
    body: `QuickBite ${orderRecord.order_number}: ${updateText}`,
  })
  await logNotification(
    orderRecord.id,
    'sms',
    orderRecord.contact_phone || '',
    `QuickBite ${orderRecord.order_number}: ${updateText}`,
    smsResult.status
  )
}

async function transitionOrderStatus(orderRecord, newStatus) {
  if (!supabase) return
  const { data: updated, error } = await supabase
    .from('orders')
    .update({
      status: newStatus,
      status_updated_at: new Date().toISOString(),
    })
    .eq('id', orderRecord.id)
    .select('*')
    .single()

  if (error || !updated) return

  const updateText = {
    preparing: 'Preparing your order',
    on_the_way: 'Driver is on the way',
    delivered: 'Order delivered',
  }[newStatus]

  if (updateText) {
    await notifyOrderUpdate(updated, updateText)
  }
}

function queueStatusTransitions(orderRecord) {
  if (!supabase) return

  if (transitionTimers.has(orderRecord.id)) {
    transitionTimers.get(orderRecord.id).forEach((timer) => clearTimeout(timer))
  }

  const prepMs = 15000 + Math.floor(Math.random() * 9000)
  const onTheWayMs = prepMs + 14000 + Math.floor(Math.random() * 9000)
  const deliveredMs = onTheWayMs + 14000 + Math.floor(Math.random() * 10000)
  const timers = [
    setTimeout(() => transitionOrderStatus(orderRecord, 'preparing'), prepMs),
    setTimeout(() => transitionOrderStatus(orderRecord, 'on_the_way'), onTheWayMs),
    setTimeout(async () => {
      await transitionOrderStatus(orderRecord, 'delivered')
      transitionTimers.delete(orderRecord.id)
    }, deliveredMs),
  ]
  transitionTimers.set(orderRecord.id, timers)
}

app.get('/api/health', async (req, res) => {
  let customersTable = 'not_configured'
  let customersError = null

  if (supabase) {
    const { error } = await supabase.from('customers').select('id').limit(1)
    if (error) {
      customersTable = 'error'
      customersError = describeAuthDbError(error, error.message || 'unknown error')
      console.error('health customers check failed', error)
    } else {
      customersTable = 'ok'
    }
  }

  res.json({
    status: 'ok',
    message: 'QuickBite API is running',
    supabase: Boolean(supabase),
    customersTable,
    customersError,
    timestamp: new Date().toISOString(),
  })
})

app.post('/api/orders', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error: 'Supabase backend is not configured',
      })
    }

    const {
      participant_id = 'anonymous',
      age_group = 'unknown',
      session_id = '',
      restaurant_name = '',
      items = [],
      subtotal = 0,
      delivery_fee = 0,
      service_fee = 0,
      promo_discount = 0,
      total = 0,
      promo_code = '',
      delivery_details = {},
      contact_email = '',
      contact_phone = '',
      card_last_four = '',
      customer_id = null,
    } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item' })
    }

    const orderNumber = `QB-${Date.now().toString().slice(-8)}`
    const trackingPublicId = crypto.randomUUID()

    const { data: orderRecord, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        tracking_public_id: trackingPublicId,
        participant_id,
        age_group,
        session_id,
        restaurant_name,
        status: 'confirmed',
        subtotal,
        delivery_fee,
        service_fee,
        promo_discount,
        total,
        promo_code,
        estimated_arrival_label: '8-12 minutes',
        delivery_full_name: delivery_details.fullName || '',
        delivery_street: delivery_details.streetAddress || '',
        delivery_city: delivery_details.city || '',
        delivery_postcode: delivery_details.postcode || '',
        delivery_phone: delivery_details.phoneNumber || contact_phone || '',
        contact_email: contact_email || '',
        contact_phone: contact_phone || delivery_details.phoneNumber || '',
        card_last_four: card_last_four || '',
        support_phone: randomSupportPhone(),
        customer_id: customer_id || null,
      })
      .select('*')
      .single()

    if (orderError || !orderRecord) {
      return res.status(500).json({ error: 'Could not create order' })
    }

    const rows = items.map((item) => ({
      order_id: orderRecord.id,
      product_id: item.productId || '',
      product_name: item.productName || '',
      product_description: item.productDescription || '',
      image_path: item.imagePath || '',
      unit_price: item.unitPrice || 0,
      quantity: item.quantity || 1,
      line_total: (item.unitPrice || 0) * (item.quantity || 1),
    }))

    await supabase.from('order_items').insert(rows)

    if (customer_id && delivery_details) {
      await supabase
        .from('customer_profiles')
        .upsert(
          {
            customer_id,
            saved_postcode: delivery_details.postcode || '',
            delivery_full_name: delivery_details.fullName || '',
            delivery_street: delivery_details.streetAddress || '',
            delivery_city: delivery_details.city || '',
            delivery_postcode: delivery_details.postcode || '',
            delivery_phone: delivery_details.phoneNumber || contact_phone || '',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'customer_id' }
        )
    }

    await notifyOrderUpdate(orderRecord, 'Order confirmed')
    queueStatusTransitions(orderRecord)

    res.status(201).json({
      success: true,
      order: {
        id: orderRecord.id,
        order_number: orderRecord.order_number,
        tracking_public_id: orderRecord.tracking_public_id,
        status: orderRecord.status,
        estimated_arrival_label: orderRecord.estimated_arrival_label,
        support_phone: orderRecord.support_phone,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unexpected error creating order' })
  }
})

app.get('/api/orders/:trackingPublicId', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase backend is not configured' })
  }

  const { trackingPublicId } = req.params
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tracking_public_id', trackingPublicId)
    .single()

  if (error || !order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  res.json({ order, items: items || [] })
})

app.post('/api/orders/:trackingPublicId/help', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase backend is not configured' })
  }

  const { trackingPublicId } = req.params
  const { issue_type = 'general', message = '' } = req.body
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('tracking_public_id', trackingPublicId)
    .single()

  if (!order) return res.status(404).json({ error: 'Order not found' })

  await supabase.from('order_help_requests').insert({
    order_id: order.id,
    issue_type,
    message,
    created_at: new Date().toISOString(),
  })

  res.json({ success: true })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`)
})