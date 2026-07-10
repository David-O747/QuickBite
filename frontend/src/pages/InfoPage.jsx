import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import InfoPageHero, { InfoStatStrip } from '../components/info/InfoPageHero'
import { InfoChannelCard, InfoNumberedBlock } from '../components/info/InfoLayoutBlocks'
import { InfoIconBadge } from '../components/info/InfoTopicIcons'

const pageContent = {
  careers: {
    title: 'Careers',
    intro: 'Join QuickBite and help people get great food, faster.',
    badge: 'Work with us',
    iconKey: 'careers',
    stats: [
      { iconKey: 'roles', label: 'Teams hiring', value: '4 areas', tone: 'red' },
      { iconKey: 'delivery', label: 'Cities growing', value: '40+', tone: 'orange' },
      { iconKey: 'partners', label: 'Restaurant partners', value: '2,000+', tone: 'gray' },
    ],
    channels: [
      {
        iconKey: 'roles',
        title: 'Open roles',
        body: 'Operations, customer support, product, and engineering — listed as we expand delivery areas.',
        meta: 'Seasonal updates on this page',
      },
      {
        iconKey: 'apply',
        title: 'How to apply',
        body: 'Send your CV and a short note about the role you want.',
        meta: 'careers@quickbite.demo',
      },
    ],
    values: [
      { iconKey: 'delivery', title: 'Move fast', text: 'Ship improvements that help real orders.' },
      { iconKey: 'support', title: 'Care deeply', text: 'Support customers and restaurant partners.' },
      { iconKey: 'partners', title: 'Think local', text: 'Grow with neighbourhood kitchens.' },
    ],
  },
  'terms-of-service': {
    title: 'Terms of Service',
    intro: 'Fair-use rules for ordering through QuickBite.',
    badge: 'Legal',
    iconKey: 'terms',
    sections: [
      {
        iconKey: 'service',
        heading: 'Using the service',
        body: 'You must provide accurate delivery details and only use QuickBite for personal food orders. Abuse, fraud, or misuse of promo codes may lead to account suspension.',
      },
      {
        iconKey: 'pricing',
        heading: 'Orders and pricing',
        body: 'Prices, fees, and availability can change. Your total is confirmed before you place an order. Mock payment in this build does not charge real cards.',
      },
      {
        iconKey: 'liability',
        heading: 'Liability',
        body: 'Restaurants are responsible for food quality and preparation. QuickBite helps connect you with local partners and manage delivery details.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    intro: 'Reach the right team for orders, partnerships, or press.',
    badge: 'Get in touch',
    iconKey: 'contact',
    stats: [
      { iconKey: 'support', label: 'Support hours', value: '8am–11pm', tone: 'red' },
      { iconKey: 'partners', label: 'Partner onboarding', value: '7 days', tone: 'orange' },
      { iconKey: 'press', label: 'Press replies', value: '48 hrs', tone: 'gray' },
    ],
    channels: [
      {
        iconKey: 'support',
        title: 'Customer support',
        body: 'Order issues, delivery questions, and account help.',
        meta: 'support@quickbite.demo',
        tone: 'red',
      },
      {
        iconKey: 'partners',
        title: 'Restaurant partners',
        body: 'Join QuickBite as a restaurant partner in your area.',
        meta: 'partners@quickbite.demo',
        tone: 'orange',
      },
      {
        iconKey: 'press',
        title: 'Press & general',
        body: 'Media enquiries and general questions about QuickBite.',
        meta: 'hello@quickbite.demo',
        tone: 'gray',
      },
    ],
  },
}

function InfoPage() {
  const { pageSlug } = useParams()
  const content = pageContent[pageSlug]

  if (!content) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Page not found</h1>
          <Link to="/" className="inline-block mt-6">
            <CtaButton ctaButtonId="info_missing_home" className="rounded-full">
              Back to home
            </CtaButton>
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (pageSlug === 'terms-of-service') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <SiteHeader />
        <InfoPageHero
          badgeText={content.badge}
          iconKey={content.iconKey}
          titleText={content.title}
          introText={content.intro}
        />
        <main className="max-w-4xl mx-auto px-4 py-12 space-y-5">
          {content.sections.map((section, index) => (
            <InfoNumberedBlock
              key={section.heading}
              stepNumber={index + 1}
              iconKey={section.iconKey}
              title={section.heading}
              body={section.body}
            />
          ))}
          <Link to="/">
            <CtaButton ctaButtonId="info_home" className="rounded-full mt-4">
              Back to home
            </CtaButton>
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <InfoPageHero
        badgeText={content.badge}
        iconKey={content.iconKey}
        titleText={content.title}
        introText={content.intro}
      />

      {content.stats && <InfoStatStrip items={content.stats} />}

      <main className="max-w-6xl mx-auto px-4 py-14 space-y-12">
        <section className="grid md:grid-cols-3 gap-5">
          {content.channels.map((channel) => (
            <InfoChannelCard
              key={channel.title}
              iconKey={channel.iconKey}
              tone={channel.tone || 'red'}
              title={channel.title}
              body={channel.body}
              meta={channel.meta}
            />
          ))}
        </section>

        {content.values && (
          <section>
            <h2 className="text-2xl font-bold mb-5">Life at QuickBite</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {content.values.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-white border border-gray-100 shadow-md p-5"
                >
                  <InfoIconBadge iconKey={item.iconKey} tone="red" size="md" />
                  <h3 className="font-bold mt-4">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <Link to="/">
          <CtaButton ctaButtonId="info_home" className="rounded-full">
            Back to home
          </CtaButton>
        </Link>
      </main>

      <SiteFooter />
    </div>
  )
}

export default InfoPage
