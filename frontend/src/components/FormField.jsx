import { useState } from 'react'
import { useMicroInteractions } from '../context/MicroInteractionsContext'

// MI 7: active border on focus
// MI 8: validation on blur only
function FormField({
  fieldId,
  labelText,
  fieldType = 'text',
  fieldValue,
  onChange,
  validateFn,
  placeholder = '',
  autoComplete,
}) {
  const miEnabled = useMicroInteractions()
  const [touched, setTouched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isValid = touched && !errorMessage && fieldValue
  const isInvalid = touched && Boolean(errorMessage)

  function handleBlur() {
    if (!miEnabled) return
    setTouched(true)
    if (validateFn) {
      const result = validateFn(fieldValue)
      setErrorMessage(result || '')
    }
  }

  let fieldClass = 'mi-field w-full px-3 py-2 rounded-lg text-sm'
  if (miEnabled && isValid) fieldClass += ' mi-valid'
  if (miEnabled && isInvalid) fieldClass += ' mi-invalid'

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block text-sm font-medium mb-1">
        {labelText}
      </label>
      <input
        id={fieldId}
        type={fieldType}
        value={fieldValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={fieldClass}
      />
      {miEnabled && isInvalid && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
      {miEnabled && isValid && (
        <p className="mt-1 text-xs text-green-600">✓</p>
      )}
    </div>
  )
}

export default FormField
