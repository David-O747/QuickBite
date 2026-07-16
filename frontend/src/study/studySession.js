const STUDY_PARTICIPANT_KEY = 'qb_study_participant'
const STUDY_AGE_KEY = 'qb_study_age'

export const STUDY_CHECKOUT_PREFILL = {
  fullName: 'Alex Johnson',
  streetAddress: '10 Downing Street',
  city: 'London',
  postcode: 'SW1A 2AA',
  phoneNumber: '07123456789',
  cardNumber: '4242 4242 4242 4242',
  cardExpiry: '12/28',
  cardCvv: '123',
}

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
