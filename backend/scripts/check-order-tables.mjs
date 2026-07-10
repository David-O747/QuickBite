#!/usr/bin/env node
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim()))
    .filter(([k]) => k)
)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const tables = ['orders', 'order_items', 'order_notifications', 'order_help_requests']
let ok = true

for (const table of tables) {
  const { error } = await supabase.from(table).select('id').limit(1)
  if (error) {
    console.error(`MISSING ${table}: ${error.message}`)
    ok = false
  } else {
    console.log(`OK ${table}`)
  }
}

process.exit(ok ? 0 : 1)
