const STUDY_PARTICIPANT_KEY = 'qb_study_participant'
const STUDY_AGE_KEY = 'qb_study_age'

export function readStudyParams() {
  const params = new URLSearchParams(window.location.search)
  const urlParticipant = params.get('participant_id')
  const urlAgeGroup = params.get('age_group')

  if (urlParticipant) {
    sessionStorage.setItem(STUDY_PARTICIPANT_KEY, urlParticipant)
  }
  if (urlAgeGroup) {
    sessionStorage.setItem(STUDY_AGE_KEY, urlAgeGroup)
  }

  const participantId =
    urlParticipant || sessionStorage.getItem(STUDY_PARTICIPANT_KEY) || 'anonymous'
  const ageGroup = urlAgeGroup || sessionStorage.getItem(STUDY_AGE_KEY) || 'unknown'

  return { participantId, ageGroup }
}

export function isStudySession(participantId) {
  return Boolean(participantId && participantId !== 'anonymous')
}
