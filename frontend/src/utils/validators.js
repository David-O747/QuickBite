export function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  if (/\s/.test(value)) return 'Email cannot contain spaces'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address'
  return ''
}

export function validateUsername(value) {
  if (!value.trim()) return 'Username is required'
  if (value.trim().length < 3) return 'Username must be at least 3 characters'
  if (/\s/.test(value)) return 'Username cannot contain spaces'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Password is required'
  return ''
}

export function validateRequired(value, fieldLabel) {
  if (!value.trim()) return `${fieldLabel} is required`
  return ''
}

export function validatePostcode(value) {
  if (!value.trim()) return 'Postcode is required'
  if (value.trim().length < 5) return 'Enter a valid postcode'
  return ''
}

export function validateCardNumber(value) {
  if (!value.trim()) return 'Card number is required'
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
