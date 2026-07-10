export function validateEmail(value) {
  if (!value.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
  return ''
}

export function validateUsername(value) {
  if (!value.trim()) return 'Username is required'
  if (value.trim().length < 3) return 'Username must be at least 3 characters'
  return ''
}

export function validateRequired(value, fieldLabel) {
  if (!value.trim()) return `${fieldLabel} is required`
  return ''
}

export function validatePostcode(value) {
  if (!value.trim()) return 'Postcode is required'
  // simple UK-style check for study forms
  if (value.trim().length < 5) return 'Enter a valid postcode'
  return ''
}

export function validateCardNumber(value) {
  if (!value.trim()) return 'Card number is required'
  // Demo checkout accepts common test lengths to reduce local-study friction
  const digitsOnly = value.replace(/\s/g, '')
  if (!/^\d{8,19}$/.test(digitsOnly)) return 'Enter a valid card number (8-19 digits)'
  return ''
}

export function validateExpiry(value) {
  if (!value.trim()) return 'Expiry is required'
  if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format'
  return ''
}

export function validateCvv(value) {
  if (!value.trim()) return 'CVV is required'
  if (!/^\d{3,4}$/.test(value)) return 'Enter a valid CVV'
  return ''
}
