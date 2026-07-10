import { useState } from 'react'
import { useMicroInteractions } from '../context/MicroInteractionsContext'

// MI 7 + 9: focus border + password strength (register only)
function PasswordField({
  fieldId,
  labelText,
  fieldValue,
  onChange,
  showStrength = false,
}) {
  const miEnabled = useMicroInteractions()
  const [isFocused, setIsFocused] = useState(false)
  const [touched, setTouched] = useState(false)

  const hasLetter = /[a-zA-Z]/.test(fieldValue)
  const hasNumber = /[0-9]/.test(fieldValue)
  const hasMinLength = fieldValue.length >= 8
  const isStrong = hasLetter && hasNumber && hasMinLength

  function handleBlur() {
    setIsFocused(false)
    setTouched(true)
  }

  let fieldClass = 'mi-field w-full px-3 py-2 rounded-lg text-sm'
  if (miEnabled && touched && isStrong) fieldClass += ' mi-valid'
  if (miEnabled && touched && fieldValue && !isStrong) fieldClass += ' mi-invalid'

  const requirements = [
    { label: '1 letter', met: hasLetter },
    { label: '1 number', met: hasNumber },
    { label: '8+ characters', met: hasMinLength },
  ]

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block text-sm font-medium mb-1">
        {labelText}
      </label>
      <input
        id={fieldId}
        type="password"
        value={fieldValue}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        autoComplete="new-password"
        className={fieldClass}
      />

      {miEnabled && showStrength && isFocused && (
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          {requirements.map((req) => (
            <li key={req.label} className="flex items-center gap-2">
              <span className={`mi-req-tick ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                {req.met ? '✓' : '–'}
              </span>
              {req.label}
            </li>
          ))}
        </ul>
      )}

      {miEnabled && touched && fieldValue && !isStrong && (
        <p className="mt-1 text-xs text-red-600">Password needs 1 letter, 1 number, 8+ characters</p>
      )}
    </div>
  )
}

export function isPasswordStrong(passwordValue) {
  return /[a-zA-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue) && passwordValue.length >= 8
}

export default PasswordField
