import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const taskTimers = {
  locate_product: null,
  add_to_basket: null,
  complete_checkout: null,
}

const hoverTimers = new Map()
let activeTaskName = null

function getSiteVersion() {
  return import.meta.env.VITE_SITE_VERSION === 'A' ? 'A' : 'B'
}

function withSiteVersion(rowData) {
  return { ...rowData, site_version: getSiteVersion() }
}

export function isSupabaseConfigured() {
  return Boolean(supabase)
}

async function insertRow(tableName, rowData) {
  const payload = withSiteVersion(rowData)

  if (!supabase) {
    const stored = JSON.parse(localStorage.getItem('qb_tracking_log') || '[]')
    stored.push({ tableName, ...payload, loggedAt: Date.now() })
    localStorage.setItem('qb_tracking_log', JSON.stringify(stored))
    return
  }

  await supabase.from(tableName).insert(payload).catch(() => undefined)
}

export function startTaskTimer(taskName) {
  taskTimers[taskName] = Date.now()
  activeTaskName = taskName
}

export function endTaskTimer(taskName, studyMeta) {
  const taskStartTime = taskTimers[taskName]
  if (!taskStartTime) return

  const taskEndTime = Date.now()
  taskTimers[taskName] = null

  insertRow('study_task_events', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    task_name: taskName,
    task_start_time: taskStartTime,
    task_end_time: taskEndTime,
    task_completion_time_ms: taskEndTime - taskStartTime,
  })

  if (activeTaskName === taskName) {
    activeTaskName = null
  }
}

export function markHoverStart(ctaButtonId) {
  hoverTimers.set(ctaButtonId, Date.now())
}

export function clearHoverStart(ctaButtonId) {
  hoverTimers.delete(ctaButtonId)
}

export function logCtaClick(ctaButtonId, event, studyMeta) {
  const clickTime = Date.now()
  const hoverStartTime = hoverTimers.get(ctaButtonId)
  const hesitation_ms =
    hoverStartTime != null ? clickTime - hoverStartTime : null

  insertRow('study_cta_events', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    task_name: activeTaskName,
    cta_button_id: ctaButtonId,
    click_x: event.clientX,
    click_y: event.clientY,
    hover_start_time: hoverStartTime ?? null,
    click_time: clickTime,
    hesitation_ms,
    is_misclick: false,
  })

  hoverTimers.delete(ctaButtonId)
}

export function logMisclick(event, studyMeta) {
  insertRow('study_cta_events', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    task_name: activeTaskName,
    cta_button_id: null,
    click_x: event.clientX,
    click_y: event.clientY,
    hover_start_time: null,
    click_time: Date.now(),
    hesitation_ms: null,
    is_misclick: true,
  })
}

export function logPopupEvent(eventType, popupId, studyMeta) {
  if (!popupId) return

  insertRow('study_popup_events', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    popup_id: popupId,
    event_type: eventType,
    event_time: Date.now(),
  })
}

export function logPostOrderFeedback(feedbackData, studyMeta) {
  insertRow('study_post_order_feedback', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    order_number: feedbackData.orderNumber,
    smoothness_rating: feedbackData.smoothnessRating,
    payment_clarity_rating: feedbackData.paymentClarityRating,
    feedback_text: feedbackData.feedbackText || '',
    submitted_at: Date.now(),
  })
}

export function logTaskMarker(taskName, markerType, studyMeta) {
  insertRow('study_task_markers', {
    participant_id: studyMeta.participantId,
    age_group: studyMeta.ageGroup,
    session_id: studyMeta.sessionId,
    task_name: taskName,
    marker_type: markerType,
    marker_time: Date.now(),
  })
}

export function getStudyMeta(appContext) {
  return {
    participantId: appContext.participantId,
    ageGroup: appContext.ageGroup,
    sessionId: appContext.sessionId,
  }
}
