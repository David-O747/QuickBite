import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'

const valueCards = [
  {
    title: 'Local first',
    text: 'We partner with neighbourhood kitchens so your order supports real local businesses.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  },
  {
    title: 'Fast delivery',
    text: 'From basket to doorstep, our flow is built to keep meals hot and waiting times low.',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop',
  },
  {
    title: 'Simple ordering',
    text: 'Clear menus, clear prices, and a checkout you can finish in minutes.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
  },
]

const stats = [
  { label: 'Partner restaurants', value: '2,000+' },
  { label: 'Cities covered', value: '40+' },
  { label: 'Orders delivered', value: '1M+' },
  { label: 'Average rating', value: '4.7★' },
]

function AboutUsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteHeader />

      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=700&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-medium text-orange-300 mb-3">About QuickBite</p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
            Food from local favourites, delivered with care
          </h1>
          <p className="mt-4 max-w-xl text-gray-100 text-lg">
            QuickBite helps you discover restaurants nearby, build your basket, and get meals
            delivered without the fuss.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton
              ctaButtonId="about_browse"
              className="rounded-full px-6"
              onClick={() => navigate('/browse')}
            >
              Browse restaurants
            </CtaButton>
            <CtaButton
              ctaButtonId="about_delivery"
              className="rounded-full px-6 !bg-white !text-red-600"
              onClick={() => navigate('/info/delivery-areas')}
            >
              Check delivery areas
            </CtaButton>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">Our story</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              QuickBite started with a simple idea: ordering food should feel as easy as choosing
              what you are craving. We built a clean food-ordering experience that connects hungry
              customers with trusted local restaurants.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              From pizza nights to sushi runs, we focus on clear menus, reliable delivery details,
              and a checkout flow that keeps you informed every step of the way.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop"
            alt="Restaurant kitchen team preparing food"
            className="w-full h-72 object-cover rounded-2xl"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center">What we stand for</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
              >
                <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-red-600 rounded-2xl text-white p-8 md:p-10">
          <h2 className="text-2xl font-bold">QuickBite in numbers</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-red-100 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop"
            alt="Delivery courier with food order"
            className="w-full h-72 object-cover rounded-2xl order-2 md:order-1"
          />
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold">Built for real orders</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Enter your address, browse nearby restaurants, add dishes to your basket, and track
              your order through delivery, payment, and confirmation. Everything is designed to feel
              familiar, fast, and trustworthy.
            </p>
            <CtaButton
              ctaButtonId="about_start_order"
              className="mt-6 rounded-full"
              onClick={() => navigate('/')}
            >
              Start ordering
            </CtaButton>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default AboutUsPage
