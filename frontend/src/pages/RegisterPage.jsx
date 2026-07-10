import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import FormField from '../components/FormField'
import PasswordField, { isPasswordStrong } from '../components/PasswordField'
import LoadingSpinner from '../components/LoadingSpinner'
import SuccessBanner from '../components/SuccessBanner'
import { validateEmail, validateUsername } from '../utils/validators'
import { getPostAuthPath } from '../study/studyFlow'
import { registerAccount } from '../api/authApi'

function RegisterPage() {
  const navigate = useNavigate()
  const app = useApp()
  const { registerCustomer } = app

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerUsername, setCustomerUsername] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleRegister(event) {
    event.preventDefault()
    setSubmitAttempted(true)

    const emailError = validateEmail(customerEmail)
    const usernameError = validateUsername(customerUsername)
    const passwordMissing = !customerPassword
    const passwordWeak = !isPasswordStrong(customerPassword)

    if (emailError || usernameError || passwordMissing || passwordWeak) {
      setFormError('Please fix the highlighted fields before continuing.')
      return
    }

    setFormError('')
    setIsLoading(true)

    try {
      const data = await registerAccount({
        email: customerEmail,
        username: customerUsername,
        password: customerPassword,
      })
      registerCustomer(data.customer)
      setShowSuccess(true)
      setTimeout(() => navigate(getPostAuthPath(app.basketItemCount)), 1500)
    } catch (error) {
      setFormError(error.message || 'Could not create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create account</h2>

        {showSuccess && (
          <SuccessBanner messageText="Account created successfully" isVisible={showSuccess} />
        )}

        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <p>{formError}</p>
            {formError.includes('already exists') && (
              <p className="mt-2">
                <Link to="/login" className="font-medium text-red-700 underline">
                  Log in instead
                </Link>
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleRegister} noValidate>
            <FormField
              fieldId="register_email"
              labelText="Email"
              fieldType="email"
              fieldValue={customerEmail}
              onChange={setCustomerEmail}
              validateFn={validateEmail}
              placeholder="you@example.com"
              autoComplete="email"
              submitAttempted={submitAttempted}
            />
            <FormField
              fieldId="register_username"
              labelText="Username"
              fieldValue={customerUsername}
              onChange={setCustomerUsername}
              validateFn={validateUsername}
              placeholder="Choose a username"
              autoComplete="username"
              submitAttempted={submitAttempted}
            />
            <PasswordField
              fieldId="register_password"
              labelText="Password"
              fieldValue={customerPassword}
              onChange={setCustomerPassword}
              showStrength
              submitAttempted={submitAttempted}
            />

            <CtaButton ctaButtonId="register_submit" type="submit" className="w-full">
              Register
            </CtaButton>
          </form>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 font-medium">Login</Link>
        </p>
      </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export default RegisterPage
