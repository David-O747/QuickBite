import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import LoadingSpinner from '../components/LoadingSpinner'
import SuccessBanner from '../components/SuccessBanner'
import { validateEmail, validateRequired } from '../utils/validators'
import { getPostAuthPath } from '../study/studyFlow'
import { loginAccount } from '../api/authApi'

function LoginPage() {
  const navigate = useNavigate()
  const app = useApp()
  const { loginCustomer } = app

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setSubmitAttempted(true)

    const emailError = validateEmail(customerEmail)
    const passwordError = validateRequired(customerPassword, 'Password')

    if (emailError || passwordError) {
      setFormError('Please fix the highlighted fields before continuing.')
      return
    }

    setFormError('')
    setIsLoading(true)

    try {
      const data = await loginAccount({
        email: customerEmail,
        password: customerPassword,
      })
      loginCustomer(data.customer)
      setShowSuccess(true)
      setTimeout(() => navigate(getPostAuthPath(app.basketItemCount)), 1500)
    } catch (error) {
      setFormError(error.message || 'Could not sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Login</h2>

        {showSuccess && (
          <SuccessBanner messageText="Logged in successfully" isVisible={showSuccess} />
        )}

        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <p>{formError}</p>
            {formError.includes('No account found') && (
              <p className="mt-2">
                <Link to="/register" className="font-medium text-red-700 underline">
                  Create an account
                </Link>
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleLogin} noValidate>
            <FormField
              fieldId="login_email"
              labelText="Email"
              fieldType="email"
              fieldValue={customerEmail}
              onChange={setCustomerEmail}
              validateFn={validateEmail}
              placeholder="you@example.com"
              autoComplete="email"
              submitAttempted={submitAttempted}
            />
            <PasswordField
              fieldId="login_password"
              labelText="Password"
              fieldValue={customerPassword}
              onChange={setCustomerPassword}
              showStrength={false}
              submitAttempted={submitAttempted}
            />

            <CtaButton ctaButtonId="login_submit" type="submit" className="w-full">
              Login
            </CtaButton>
          </form>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Need an account?{' '}
          <Link to="/register" className="text-red-600 font-medium">Register</Link>
        </p>
      </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export default LoginPage
