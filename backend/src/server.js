const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')
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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'QuickBite API is running',
    supabase: Boolean(supabase),
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
  console.log(`QuickBite API server running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})