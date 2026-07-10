import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'

function OffersPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Current offers</h1>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <article className="bg-red-600 text-white rounded-2xl p-6">
            <h2 className="text-xl font-bold">WELCOME10</h2>
            <p className="mt-2 text-red-100">£10 off your first order over £30.</p>
            <CtaButton
              ctaButtonId="offers_claim"
              className="mt-4 !bg-white !text-red-600 rounded-full"
              onClick={() => navigate('/register')}
            >
              Claim now
            </CtaButton>
          </article>
          <article className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Free delivery weekend</h2>
            <p className="mt-2 text-gray-500">No delivery fee on orders over £20 every Saturday.</p>
            <CtaButton
              ctaButtonId="offers_browse"
              className="mt-4 !bg-white !text-red-600 border border-red-200 rounded-full"
              onClick={() => navigate('/browse')}
            >
              Browse restaurants
            </CtaButton>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default OffersPage
