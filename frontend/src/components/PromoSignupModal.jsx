import { useState } from 'react'
import { useApp } from '../context/AppContext'

function PromoSignupModal({ isOpen, onClose }) {
  const { claimWelcomePromo, showToast } = useApp()
  const [emailInput, setEmailInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  if (!isOpen) return null

  function handleSubmit(event) {
    event.preventDefault()
    if (!emailInput.trim()) return
    setSubmitted(true)
    claimWelcomePromo()
  }

  function copyPromoCode() {
    navigator.clipboard.writeText('WELCOME10')
    setCodeCopied(true)
    showToast('Code copied!')
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <button type="button" onClick={onClose} className="float-right text-gray-500 text-xl">×</button>

        {!submitted ? (
          <>
            <h3 className="text-xl font-bold">Get £10 off your first order</h3>
            <p className="text-sm text-gray-500 mt-2">Sign up and use code WELCOME10 on orders over £30.</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Your email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
              <button type="submit" className="qb-btn w-full bg-red-600 text-white py-3 rounded-full font-medium">Get Started Now</button>
            </form>
            <button
              type="button"
              onClick={copyPromoCode}
              className="mt-3 w-full text-sm text-red-600 border border-red-200 py-2 rounded-full"
            >
              {codeCopied ? 'Copied!' : 'Copy code WELCOME10'}
            </button>
          </>
        ) : (
          <div className="text-center py-4 fade-in">
            <p className="text-4xl">✓</p>
            <p className="font-bold mt-3">You&apos;re all set!</p>
            <p className="text-sm text-gray-500 mt-2">WELCOME10 is ready to use at checkout.</p>
            <button type="button" onClick={onClose} className="qb-btn mt-5 bg-red-600 text-white px-6 py-2 rounded-full text-sm">Start ordering</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromoSignupModal
