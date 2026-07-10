import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import PolicyPopup from '../components/PolicyPopup'
import InfoPageHero from '../components/info/InfoPageHero'
import { InfoTopicCard } from '../components/info/InfoLayoutBlocks'
import { InfoIconBadge } from '../components/info/InfoTopicIcons'
import CtaButton from '../components/CtaButton'

const cookieSections = [
  {
    sectionId: 'essential-cookies',
    iconKey: 'essential-cookies',
    sectionTitle: 'Essential cookies',
    shortText: 'Needed for login, basket, and delivery address.',
    popupBody:
      'Essential cookies keep core features working:\n• Login session so you stay signed in\n• Basket contents while you browse\n• Saved delivery address\n• Site version settings for the study\n\nThese cookies are required for QuickBite to function and cannot be turned off in this build.',
  },
  {
    sectionId: 'preference-cookies',
    iconKey: 'preference-cookies',
    sectionTitle: 'Preference cookies',
    shortText: 'Remember choices like favourites and promo claims.',
    popupBody:
      'Preference cookies store choices you make on the site, such as favourite restaurants and whether a welcome promo has been claimed.\n\nThey help the site feel consistent when you return, without tracking you across other websites.',
  },
  {
    sectionId: 'study-cookies',
    iconKey: 'study-cookies',
    sectionTitle: 'Study / analytics cookies',
    shortText: 'Support silent academic interaction logging.',
    popupBody:
      'For the academic A/B study, QuickBite may store a session ID and related research identifiers.\n\nThese help measure task completion time and CTA engagement. No advertising cookies are used, and no third-party ad networks are loaded.',
  },
  {
    sectionId: 'manage-cookies',
    iconKey: 'manage-cookies',
    sectionTitle: 'Managing cookies',
    shortText: 'How to clear or control cookies in your browser.',
    popupBody:
      'You can clear cookies anytime in your browser settings.\n\nIf you clear cookies:\n• You may be signed out\n• Your basket may reset\n• Saved delivery address may be removed\n\nEssential cookies will be set again when you use those features.',
  },
]

function CookiePolicyPage() {
  const app = useApp()
  const [activeSection, setActiveSection] = useState(null)
  const [preferences, setPreferences] = useState(app.cookiePreferences)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    setPreferences(app.cookiePreferences)
  }, [app.cookiePreferences])

  function togglePreference(key) {
    if (key === 'essential') return
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  function savePreferences() {
    app.saveCookiePreferences(preferences)
    setSavedMessage(
      app.isLoggedIn
        ? 'Cookie preferences saved to your account.'
        : 'Cookie preferences saved on this device.'
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <InfoPageHero
        badgeText="Cookie settings"
        iconKey="cookie"
        titleText="Cookie Policy"
        introText="See what each cookie type does and manage your choices on this device."
      />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {cookieSections.map((section) => (
              <InfoTopicCard
                key={section.sectionId}
                iconKey={section.iconKey}
                title={section.sectionTitle}
                summary={section.shortText}
                actionLabel="Open details →"
                onOpen={() => setActiveSection(section)}
              />
            ))}
          </section>

          <aside className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-5">
                <InfoIconBadge iconKey="manage-cookies" tone="red" size="md" />
                <h2 className="text-xl font-bold">Your preferences</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Essential cookies stay on. Turn preference and study cookies off if you prefer.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'essential', label: 'Essential', iconKey: 'essential-cookies', locked: true },
                  { key: 'preferences', label: 'Preferences', iconKey: 'preference-cookies', locked: false },
                  { key: 'study', label: 'Study / analytics', iconKey: 'study-cookies', locked: false },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <InfoIconBadge iconKey={item.iconKey} tone="gray" size="sm" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.locked && (
                          <p className="text-xs text-gray-500">Always active</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={item.locked}
                      onClick={() => togglePreference(item.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        preferences[item.key]
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } ${item.locked ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {preferences[item.key] ? 'On' : 'Off'}
                    </button>
                  </div>
                ))}
              </div>

              <CtaButton
                ctaButtonId="cookie_save_preferences"
                className="w-full mt-6 rounded-xl"
                onClick={savePreferences}
              >
                Save preferences
              </CtaButton>

              {savedMessage && (
                <p className="mt-4 text-sm text-green-700">{savedMessage}</p>
              )}
            </div>
          </aside>
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

export default CookiePolicyPage
