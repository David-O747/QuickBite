const STUDY_PARTICIPANT_KEY = 'qb_study_participant'
const STUDY_AGE_KEY = 'qb_study_age'

function cleanParam(value) {
  if (value == null) return null
  let cleaned = String(value).trim()
  if (!cleaned) return null

  // URLSearchParams already decodes once (65%2B -> 65+).
  // If a value is still percent-encoded, decode one more time.
  if (/%[0-9A-Fa-f]{2}/.test(cleaned)) {
    try {
      cleaned = decodeURIComponent(cleaned).trim()
    } catch {
      // keep original trimmed value
    }
  }

  return cleaned || null
}

/**
 * Reads study params from the current URL.
 * When present, participant_id and age_group are stored exactly as in the query string
 * (e.g. P01, 18-25, 65+). Never generates a custom participant id.
 */
export function readStudyParams(search = window.location.search) {
  const params = new URLSearchParams(search)
  const urlParticipant = cleanParam(params.get('participant_id'))
  const urlAgeGroup = cleanParam(params.get('age_group'))

  if (urlParticipant) {
    sessionStorage.setItem(STUDY_PARTICIPANT_KEY, urlParticipant)
  }
  if (urlAgeGroup) {
    sessionStorage.setItem(STUDY_AGE_KEY, urlAgeGroup)
  }

  const participantId =
    urlParticipant || cleanParam(sessionStorage.getItem(STUDY_PARTICIPANT_KEY)) || 'anonymous'
  const ageGroup =
    urlAgeGroup || cleanParam(sessionStorage.getItem(STUDY_AGE_KEY)) || 'unknown'

  return { participantId, ageGroup }
}

export function isStudySession(participantId) {
  return Boolean(participantId && participantId !== 'anonymous')
}
