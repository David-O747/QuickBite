#!/usr/bin/env node

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')

function loadEnv() {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }
  return env
}

const env = loadEnv()
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const tables = ['orders', 'order_items', 'order_notifications', 'order_help_requests']

for (const table of tables) {
  const { error } = await supabase.from(table).select('id').limit(1)
  if (error) {
    console.error(`FAIL ${table}: ${error.message}`)
    console.error('\nRun supabase/order_tables_only.sql in Supabase SQL Editor, then retry.')
    process.exit(1)
  }
  console.log(`OK   ${table} exists`)
}

const apiBase = 'http://127.0.0.1:3000'
const health = await fetch(`${apiBase}/api/health`).then((r) => r.json()).catch(() => null)
if (!health?.supabase) {
  console.error('FAIL backend not running or Supabase not configured')
  console.error('Start: cd backend && node src/server.js')
  process.exit(1)
}
console.log('OK   backend /api/health')

const testOrder = await fetch(`${apiBase}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    participant_id: 'verify_test',
    age_group: 'test',
    session_id: `verify_${Date.now()}`,
    restaurant_name: 'Test Kitchen',
    items: [{ productId: 't1', productName: 'Test Burger', unitPrice: 9.99, quantity: 1 }],
    subtotal: 9.99,
    delivery_fee: 2.99,
    service_fee: 1.5,
    total: 14.48,
    contact_email: 'dolapade747@gmail.com',
    contact_phone: '+44746321151',
    delivery_details: { fullName: 'Test', phoneNumber: '0746321151' },
  }),
}).then((r) => r.json())

if (!testOrder?.order?.order_number) {
  console.error('FAIL create order:', testOrder.error || testOrder)
  process.exit(1)
}

console.log(`OK   order created: ${testOrder.order.order_number}`)
console.log('\nOrders backend is live. Email/SMS stay mocked until SendGrid/Twilio keys are added.')
