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

function RegisterPage() {
  const navigate = useNavigate()
  const app = useApp()
  const { registerCustomer } = app

  const [customerEmail, setCustomerEmail] = useState('')
  const [customerUsername, setCustomerUsername] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleRegister(event) {
    event.preventDefault()

    const emailError = validateEmail(customerEmail)
    const usernameError = validateUsername(customerUsername)
    if (emailError || usernameError || !isPasswordStrong(customerPassword)) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 400))

    registerCustomer({ customerEmail, customerUsername })
    setIsLoading(false)
    setShowSuccess(true)

    setTimeout(() => navigate(getPostAuthPath(app.basketItemCount)), 1500)
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

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleRegister}>
            <FormField
              fieldId="register_email"
              labelText="Email"
              fieldType="email"
              fieldValue={customerEmail}
              onChange={setCustomerEmail}
              validateFn={validateEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FormField
              fieldId="register_username"
              labelText="Username"
              fieldValue={customerUsername}
              onChange={setCustomerUsername}
              validateFn={validateUsername}
              placeholder="Choose a username"
              autoComplete="username"
            />
            <PasswordField
              fieldId="register_password"
              labelText="Password"
              fieldValue={customerPassword}
              onChange={setCustomerPassword}
              showStrength
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
