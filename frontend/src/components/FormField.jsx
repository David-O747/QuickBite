import { useEffect, useState } from 'react'
import { useMicroInteractions } from '../context/MicroInteractionsContext'

function FormField({
  fieldId,
  labelText,
  fieldType = 'text',
  fieldValue,
  onChange,
  validateFn,
  placeholder = '',
  autoComplete,
  submitAttempted = false,
}) {
  const miEnabled = useMicroInteractions()
  const [touched, setTouched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const showValidation = touched || submitAttempted
  const isInvalid = miEnabled && showValidation && Boolean(errorMessage)
  const isValid = miEnabled && touched && !errorMessage && fieldValue

  useEffect(() => {
    if (!showValidation || !validateFn) return
    setErrorMessage(validateFn(fieldValue) || '')
  }, [fieldValue, showValidation, validateFn])

  function handleBlur() {
    setTouched(true)
    if (validateFn) {
      setErrorMessage(validateFn(fieldValue) || '')
    }
  }

  function handleChange(nextValue) {
    onChange(nextValue)
    if ((touched || submitAttempted) && validateFn) {
      setErrorMessage(validateFn(nextValue) || '')
    }
  }

  const inputType = fieldType === 'email' ? 'text' : fieldType
  const inputMode = fieldType === 'email' ? 'email' : undefined

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
        name={fieldId}
        type={inputType}
        inputMode={inputMode}
        value={fieldValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete={autoComplete || 'off'}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-1p-ignore={autoComplete === 'off' ? 'true' : undefined}
        data-lpignore={autoComplete === 'off' ? 'true' : undefined}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${fieldId}_error` : undefined}
        className={fieldClass}
      />
      {isInvalid && (
        <p id={`${fieldId}_error`} className="mt-1 text-xs text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      {isValid && (
        <p className="mt-1 text-xs text-green-600" aria-hidden="true">
          ✓
        </p>
      )}
    </div>
  )
}

export default FormField
