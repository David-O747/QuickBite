import { useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import PolicyPopup from '../components/PolicyPopup'
import InfoPageHero, { InfoStatStrip } from '../components/info/InfoPageHero'
import { InfoTopicCard } from '../components/info/InfoLayoutBlocks'

const privacySections = [
  {
    sectionId: 'data-we-collect',
    iconKey: 'data-we-collect',
    tone: 'red',
    featured: true,
    sectionTitle: 'Data we collect',
    shortText: 'Account details, delivery address, order history, and basic device info.',
    popupBody:
      'We collect information you provide when you register, place an order, or contact support. This includes your name, email, username, delivery address, phone number, and order details.\n\nWe also store basic technical data such as session ID for study tracking and site performance. Payment fields in this build are mock only and are not sent to a real payment provider.',
  },
  {
    sectionId: 'how-we-use',
    iconKey: 'how-we-use',
    tone: 'orange',
    sectionTitle: 'How we use your data',
    shortText: 'To run your account, deliver orders, and improve QuickBite.',
    popupBody:
      'We use your data to:\n• Create and manage your account\n• Process and deliver orders\n• Show restaurants near your address\n• Send order updates and support replies\n• Improve site reliability and research quality\n\nWe do not sell your personal data.',
  },
  {
    sectionId: 'study-tracking',
    iconKey: 'study-tracking',
    tone: 'gray',
    sectionTitle: 'Study tracking',
    shortText: 'Silent research metrics may be logged for academic analysis.',
    popupBody:
      'QuickBite Site B may silently log task timing and button interaction metrics for an academic A/B study.\n\nLogged fields can include participant ID, age group, session ID, task completion times, and CTA click metrics. No tracking UI is shown during normal use. Data can be exported as CSV from Supabase for analysis.',
  },
  {
    sectionId: 'data-sharing',
    iconKey: 'data-sharing',
    tone: 'red',
    sectionTitle: 'Who we share data with',
    shortText: 'Restaurants, delivery partners, and essential service providers only.',
    popupBody:
      'We share only what is needed to complete your order:\n• Restaurant partners receive order items and delivery notes\n• Delivery partners receive address and contact details\n• Infrastructure providers (such as hosting/database) store data securely\n\nWe do not share data for advertising networks.',
  },
  {
    sectionId: 'your-rights',
    iconKey: 'your-rights',
    tone: 'green',
    sectionTitle: 'Your rights',
    shortText: 'Access, update, or request deletion of your information.',
    popupBody:
      'You can request access to the personal data we hold, ask us to correct inaccurate details, or request deletion of your account data where legally allowed.\n\nContact privacy@quickbite.demo and include the email used on your account. We aim to respond within 30 days.',
  },
  {
    sectionId: 'data-retention',
    iconKey: 'data-retention',
    tone: 'gray',
    sectionTitle: 'How long we keep data',
    shortText: 'Only as long as needed for orders, support, and legal requirements.',
    popupBody:
      'Order records are kept for accounting and support purposes. Account data remains while your account is active.\n\nStudy logs are retained for the duration of the research project and then deleted or anonymised. You can request earlier deletion where applicable.',
  },
]

function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(null)
  const featured = privacySections.find((s) => s.featured)
  const rest = privacySections.filter((s) => !s.featured)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <InfoPageHero
        badgeText="Your privacy"
        iconKey="privacy"
        titleText="Privacy Policy"
        introText="What QuickBite collects, why we collect it, and how you stay in control."
      />

      <InfoStatStrip
        items={[
          { iconKey: 'your-rights', label: 'You control your data', value: 'Your rights', tone: 'green' },
          { iconKey: 'data-sharing', label: 'No ad network sharing', value: 'Limited sharing', tone: 'red' },
          { iconKey: 'data-retention', label: 'Kept only as needed', value: 'Clear retention', tone: 'gray' },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 py-14">
        <p className="text-sm text-gray-500 mb-6">Last updated: July 2026 · Tap a topic for full details</p>

        <div className="grid lg:grid-cols-3 gap-5">
          {featured && (
            <div className="lg:row-span-2">
              <InfoTopicCard
                iconKey={featured.iconKey}
                tone={featured.tone}
                title={featured.sectionTitle}
                summary={featured.shortText}
                actionLabel="Read full details →"
                featured
                onOpen={() => setActiveSection(featured)}
              />
            </div>
          )}

          {rest.slice(0, 2).map((section) => (
            <InfoTopicCard
              key={section.sectionId}
              iconKey={section.iconKey}
              tone={section.tone}
              title={section.sectionTitle}
              summary={section.shortText}
              actionLabel="Open section →"
              onOpen={() => setActiveSection(section)}
            />
          ))}

          {rest.slice(2).map((section) => (
            <InfoTopicCard
              key={section.sectionId}
              iconKey={section.iconKey}
              tone={section.tone}
              title={section.sectionTitle}
              summary={section.shortText}
              actionLabel="Open section →"
              onOpen={() => setActiveSection(section)}
            />
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-[auto_1fr] gap-5 rounded-2xl bg-white border border-red-100 p-6 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold">
            @
          </div>
          <div>
            <h2 className="font-bold text-lg">Privacy contact</h2>
            <p className="mt-2 text-sm text-gray-700">
              Questions about privacy? Email <strong>privacy@quickbite.demo</strong> — we reply within 30 days.
            </p>
          </div>
        </div>
      </main>

      <PolicyPopup
        isOpen={Boolean(activeSection)}
        titleText={activeSection?.sectionTitle || ''}
        bodyText={activeSection?.popupBody || ''}
        onClose={() => setActiveSection(null)}
      />

      <SiteFooter />
    </div>
  )
}

export default PrivacyPolicyPage
