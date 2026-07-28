import { readStudyParams } from '../study/studySession'
import { trackStudyRow } from '../api/studyApi'

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
  // Study events are saved through the Render API (works on both Netlify sites).
  return Boolean(import.meta.env.VITE_API_URL)
}

export function getActiveTaskName() {
  return activeTaskName
}

async function insertRow(tableName, rowData) {
  const payload = withSiteVersion(rowData)

  try {
    await trackStudyRow(tableName, payload)
    return { ok: true }
  } catch (error) {
    console.error(`[tracking] Failed to insert into ${tableName}`, error, payload)

    // Keep a local backup so a failed network call is still recoverable.
    try {
      const stored = JSON.parse(localStorage.getItem('qb_tracking_log') || '[]')
      stored.push({ tableName, ...payload, loggedAt: Date.now(), error: String(error?.message || error) })
      localStorage.setItem('qb_tracking_log', JSON.stringify(stored))
    } catch {
      // ignore local backup failures
    }

    return { ok: false, error }
  }
}

export function startTaskTimer(taskName) {
  if (!Object.prototype.hasOwnProperty.call(taskTimers, taskName)) return
  taskTimers[taskName] = Date.now()
  activeTaskName = taskName
}

export function endTaskTimer(taskName, studyMeta) {
  const taskStartTime = taskTimers[taskName]
  if (!taskStartTime) return null

  const taskEndTime = Date.now()
  taskTimers[taskName] = null

  const row = {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    task_name: taskName,
    task_start_time: taskStartTime,
    task_end_time: taskEndTime,
    task_completion_time_ms: Number(taskEndTime - taskStartTime),
  }

  insertRow('study_task_events', row)

  if (activeTaskName === taskName) {
    activeTaskName = null
  }

  return row
}

export function markHoverStart(ctaButtonId) {
  if (!ctaButtonId) return
  hoverTimers.set(ctaButtonId, Date.now())
}

export function clearHoverStart(ctaButtonId) {
  if (!ctaButtonId) return
  hoverTimers.delete(ctaButtonId)
}

export function logCtaClick(ctaButtonId, event, studyMeta) {
  const clickTime = Date.now()
  const hoverStartTime = hoverTimers.get(ctaButtonId)
  const hesitation_ms =
    hoverStartTime != null ? Number(clickTime - hoverStartTime) : null

  insertRow('study_cta_events', {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    task_name: activeTaskName,
    cta_button_id: ctaButtonId,
    click_x: Number(event.clientX) || 0,
    click_y: Number(event.clientY) || 0,
    hover_start_time: hoverStartTime ?? null,
    click_time: clickTime,
    hesitation_ms,
    is_misclick: false,
  })

  hoverTimers.delete(ctaButtonId)
}

export function logMisclick(event, studyMeta) {
  insertRow('study_cta_events', {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    task_name: activeTaskName,
    cta_button_id: null,
    click_x: Number(event.clientX) || 0,
    click_y: Number(event.clientY) || 0,
    hover_start_time: null,
    click_time: Date.now(),
    hesitation_ms: null,
    is_misclick: true,
  })
}

export function logPopupEvent(eventType, popupId, studyMeta) {
  if (!popupId) return

  insertRow('study_popup_events', {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    popup_id: popupId,
    event_type: eventType,
    event_time: Date.now(),
  })
}

export function logPostOrderFeedback(feedbackData, studyMeta) {
  insertRow('study_post_order_feedback', {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    order_number: feedbackData.orderNumber,
    smoothness_rating: feedbackData.smoothnessRating,
    payment_clarity_rating: feedbackData.paymentClarityRating,
    feedback_text: feedbackData.feedbackText || '',
    submitted_at: Date.now(),
  })
}

export function logTaskMarker(taskName, markerType, studyMeta) {
  insertRow('study_task_markers', {
    participant_id: String(studyMeta.participantId || ''),
    age_group: String(studyMeta.ageGroup || ''),
    session_id: String(studyMeta.sessionId || ''),
    task_name: taskName,
    marker_type: markerType,
    marker_time: Date.now(),
  })
}

export function getStudyMeta(appContext) {
  // Always re-read URL/session so participant_id and age_group stay exact
  // even after client-side navigations that drop query params.
  const live = readStudyParams()
  return {
    participantId: live.participantId,
    ageGroup: live.ageGroup,
    sessionId: appContext.sessionId,
  }
}
