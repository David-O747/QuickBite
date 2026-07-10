import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import FormField from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import { geocodeAddress } from '../api/geocodeAddress'
import { useApp } from '../context/AppContext'

const coverageCities = [
  {
    cityName: 'London',
    coverageNote: 'Central, North, South, East & West',
    imagePath: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Manchester',
    coverageNote: 'City centre and surrounding boroughs',
    imagePath: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Birmingham',
    coverageNote: 'City centre and nearby districts',
    imagePath: 'https://images.unsplash.com/photo-1605283176568-9b41fde3672e?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Leeds',
    coverageNote: 'City centre and student areas',
    imagePath: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Glasgow',
    coverageNote: 'City centre and west end',
    imagePath: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Bristol',
    coverageNote: 'City centre and harbour areas',
    imagePath: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Edinburgh',
    coverageNote: 'Old Town, New Town and nearby',
    imagePath: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
  },
  {
    cityName: 'Liverpool',
    coverageNote: 'City centre and waterfront',
    imagePath: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&sat=-20',
  },
]

function DeliveryAreasPage() {
  const navigate = useNavigate()
  const app = useApp()
  const [postcodeInput, setPostcodeInput] = useState(app.deliveryAddress || '')
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState(null)

  async function handleCheckCoverage(event) {
    event.preventDefault()
    if (!postcodeInput.trim()) return

    setIsChecking(true)
    setCheckResult(null)

    const location = await geocodeAddress(postcodeInput)

    setIsChecking(false)

    if (!location) {
      setCheckResult({
        isCovered: false,
        message: 'We could not find that address or postcode. Try a UK postcode like SW1A 1AA.',
      })
      return
    }

    app.setDeliveryAddress(postcodeInput.trim())
    setCheckResult({
      isCovered: true,
      message: `Good news — we deliver near ${location.displayName.split(',').slice(0, 2).join(',')}.`,
      displayName: location.displayName,
    })
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteHeader />

      <section className="bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold">Delivery areas</h1>
            <p className="mt-4 text-red-100 text-lg">
              Check if QuickBite delivers to your address or postcode, then browse restaurants nearby.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=500&fit=crop"
            alt="Food delivery on a city street"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <section className="border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
          <h2 className="text-2xl font-bold">Check your postcode</h2>
          <p className="mt-2 text-gray-600">
            Enter a UK address or postcode to see if we cover your area.
          </p>

          <form onSubmit={handleCheckCoverage} className="mt-6 max-w-xl">
            <FormField
              fieldId="delivery_area_postcode"
              labelText="Address or postcode"
              fieldValue={postcodeInput}
              onChange={setPostcodeInput}
              validateFn={(value) => (!value.trim() ? 'Address or postcode is required' : '')}
              placeholder="e.g. SW1A 1AA or Manchester"
            />
            <CtaButton
              ctaButtonId="delivery_check_coverage"
              type="submit"
              className="rounded-full"
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check coverage'}
            </CtaButton>
          </form>

          {isChecking && <LoadingSpinner />}

          {checkResult && (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                checkResult.isCovered
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <p>{checkResult.message}</p>
              {checkResult.isCovered && (
                <div className="mt-3">
                  <CtaButton
                    ctaButtonId="delivery_find_nearby"
                    className="rounded-full"
                    onClick={() => navigate(`/?near=${encodeURIComponent(postcodeInput.trim())}`)}
                  >
                    Find restaurants near me
                  </CtaButton>
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold">Cities we cover</h2>
          <p className="mt-2 text-gray-600">
            We are live across major UK cities and keep expanding every month.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coverageCities.map((city) => (
              <article
                key={city.cityName}
                className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white"
              >
                <img
                  src={city.imagePath}
                  alt={city.cityName}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{city.cityName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{city.coverageNote}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Typical delivery', text: '20–40 minutes depending on distance and restaurant prep time.' },
            { title: 'Delivery fees', text: 'Shown clearly on each restaurant card before you order.' },
            { title: 'Not listed?', text: 'Try your full postcode. Coverage can vary street by street.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-100 p-5 bg-gray-50">
              <h3 className="font-bold text-red-600">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default DeliveryAreasPage
