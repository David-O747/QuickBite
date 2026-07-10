#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error('Missing frontend/.env — copy from .env.example and add Supabase keys.')
    process.exit(1)
  }
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY

if (!url || url.includes('your_supabase') || !key || key.includes('your_supabase')) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env')
  process.exit(1)
}

const supabase = createClient(url, key)
const testId = `verify_${Date.now()}`

const tables = [
  'study_task_events',
  'study_cta_events',
  'study_task_markers',
  'study_post_order_feedback',
]

let ok = true

for (const table of tables) {
  const row =
    table === 'study_task_events'
      ? {
          participant_id: testId,
          age_group: 'test',
          session_id: testId,
          site_version: 'B',
          task_name: 'locate_product',
          task_start_time: Date.now() - 1000,
          task_end_time: Date.now(),
          task_completion_time_ms: 1000,
        }
      : table === 'study_cta_events'
      ? {
          participant_id: testId,
          age_group: 'test',
          session_id: testId,
          site_version: 'B',
          task_name: 'locate_product',
          click_time: Date.now(),
          is_misclick: false,
        }
      : table === 'study_task_markers'
      ? {
          participant_id: testId,
          age_group: 'test',
          session_id: testId,
          site_version: 'B',
          task_name: 'add_to_basket',
          marker_type: 'verbal_start',
          marker_time: Date.now(),
        }
      : {
          participant_id: testId,
          age_group: 'test',
          session_id: testId,
          site_version: 'B',
          order_number: 'TEST-001',
          smoothness_rating: 5,
          payment_clarity_rating: 5,
          submitted_at: Date.now(),
        }

  const { error } = await supabase.from(table).insert(row)
  if (error) {
    console.error(`FAIL ${table}:`, error.message)
    ok = false
  } else {
    console.log(`OK   ${table} insert`)
  }
}

if (ok) {
  console.log('\nSupabase study logging is ready.')
  console.log(`Delete test rows where participant_id = '${testId}' in Table Editor if you like.`)
} else {
  console.log('\nRun supabase/setup_all.sql in your Supabase SQL Editor, then retry.')
  process.exit(1)
}
