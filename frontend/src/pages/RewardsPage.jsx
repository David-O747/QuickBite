import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'

function RewardsPage() {
  const navigate = useNavigate()
  const [isMember, setIsMember] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">QuickBite Rewards</h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Earn points every time you order. 100 points = £1 off your next meal.
        </p>

        <div className="mt-8 border border-gray-200 rounded-2xl p-6 max-w-md">
          <p className="text-sm text-gray-500">Your balance</p>
          <p className="text-4xl font-bold text-red-600 mt-1">
            {isMember ? '25 pts' : '0 pts'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {isMember
              ? 'Welcome bonus applied. Place orders to keep growing points.'
              : 'Place an order to start earning.'}
          </p>

          {!isMember ? (
            <CtaButton
              ctaButtonId="rewards_join"
              className="mt-4 rounded-full"
              onClick={() => setIsMember(true)}
            >
              Join rewards
            </CtaButton>
          ) : (
            <CtaButton
              ctaButtonId="rewards_browse"
              className="mt-4 !bg-white !text-red-600 border border-red-200 rounded-full"
              onClick={() => navigate('/')}
            >
              Browse restaurants
            </CtaButton>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default RewardsPage
