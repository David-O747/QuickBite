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

function LoginPage() {
  const navigate = useNavigate()
  const app = useApp()
  const { loginCustomer } = app

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    if (validateEmail(customerEmail) || validateRequired(customerPassword, 'Password')) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    loginCustomer({ customerEmail })
    setIsLoading(false)
    setShowSuccess(true)

    setTimeout(() => navigate(getPostAuthPath(app.basketItemCount)), 1500)
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

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleLogin}>
            <FormField
              fieldId="login_email"
              labelText="Email"
              fieldType="email"
              fieldValue={customerEmail}
              onChange={setCustomerEmail}
              validateFn={validateEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <PasswordField
              fieldId="login_password"
              labelText="Password"
              fieldValue={customerPassword}
              onChange={setCustomerPassword}
              showStrength={false}
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
