import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import FormField from '../components/FormField'
import InfoPageHero from '../components/info/InfoPageHero'
import { InfoIconBadge } from '../components/info/InfoTopicIcons'

const groupIcons = {
  Orders: 'orders',
  Delivery: 'delivery',
  'Payments & account': 'payment',
}

const faqGroups = [
  {
    groupTitle: 'Orders',
    questions: [
      {
        questionId: 'order-track',
        questionText: 'How do I track my order?',
        answerText:
          'After you place an order you will see the confirmation page with your order number and delivery details. You can also find recent order info in your account once signed in.',
      },
      {
        questionId: 'order-change',
        questionText: 'Can I change an order after placing it?',
        answerText:
          'Once an order is confirmed, restaurants usually start preparing it straight away. Contact support as soon as possible with your order number and we will check if a change is still possible.',
      },
      {
        questionId: 'order-cancel',
        questionText: 'How do I cancel an order?',
        answerText:
          'Cancellations depend on restaurant prep status. Open Help Centre contact options and include your order number. If the restaurant has not started, we can usually cancel.',
      },
    ],
  },
  {
    groupTitle: 'Delivery',
    questions: [
      {
        questionId: 'delivery-time',
        questionText: 'How long does delivery take?',
        answerText:
          'Most orders arrive in 20–40 minutes. Delivery time depends on distance, traffic, and how busy the restaurant is. Estimated times are shown on each restaurant card.',
      },
      {
        questionId: 'delivery-area',
        questionText: 'Do you deliver to my area?',
        answerText:
          'Use the Delivery Areas page and enter your postcode. If we cover your address, you can jump straight into nearby restaurants.',
      },
      {
        questionId: 'delivery-fee',
        questionText: 'How are delivery fees calculated?',
        answerText:
          'Fees vary by restaurant and distance. You will always see the fee on the restaurant card and again before you place your order.',
      },
    ],
  },
  {
    groupTitle: 'Payments & account',
    questions: [
      {
        questionId: 'payment-methods',
        questionText: 'What payment methods do you accept?',
        answerText:
          'Checkout supports card payments. This study build uses mock payment fields only — no real charges are taken.',
      },
      {
        questionId: 'account-create',
        questionText: 'How do I create an account?',
        answerText:
          'Go to Register, enter your email, username, and password. You will see a success message, then you can start ordering.',
      },
      {
        questionId: 'promo-code',
        questionText: 'How do promo codes work?',
        answerText:
          'Use WELCOME10 on your first order over £30 for £10 off. Codes are shown on Offers and the home promo banner.',
      },
    ],
  },
]

function HelpCentrePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [openQuestionId, setOpenQuestionId] = useState('order-track')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [formSent, setFormSent] = useState(false)
  const issueType = searchParams.get('issue') || ''
  const issueOrderId = searchParams.get('order_id') || ''

  useEffect(() => {
    if (issueType === 'late-order') {
      setSearchQuery('delivery')
      setContactMessage(
        issueOrderId
          ? `Order ${issueOrderId} has not arrived on time. Please help and provide an update.`
          : 'My order has not arrived on time. Please help and provide an update.'
      )
      setOpenQuestionId('delivery-time')
    }
  }, [issueType, issueOrderId])

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return faqGroups

    return faqGroups
      .map((group) => ({
        ...group,
        questions: group.questions.filter(
          (item) =>
            item.questionText.toLowerCase().includes(query) ||
            item.answerText.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.questions.length > 0)
  }, [searchQuery])

  function toggleQuestion(questionId) {
    setOpenQuestionId((current) => (current === questionId ? null : questionId))
  }

  function handleContactSubmit(event) {
    event.preventDefault()
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return
    setFormSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <InfoPageHero
        badgeText="Support"
        iconKey="help"
        titleText="Help Centre"
        introText="Find answers fast, or send us a message if you still need help with an order."
      />

      <section className="border-b border-gray-100 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
            <div className="max-w-xl">
              <label htmlFor="help_search" className="text-sm font-medium text-gray-700">
                Search help topics
              </label>
              <input
                id="help_search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. delivery, promo code, cancel order"
                className="mi-field w-full rounded-full px-4 py-3 text-sm mt-2"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <CtaButton
                ctaButtonId="help_delivery_areas"
                className="rounded-full"
                onClick={() => navigate('/info/delivery-areas')}
              >
                Delivery areas
              </CtaButton>
              <CtaButton
                ctaButtonId="help_browse"
                className="rounded-full bg-white! text-red-600! border border-red-200"
                onClick={() => navigate('/')}
              >
                Find restaurants
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          {issueType === 'late-order' && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h2 className="text-lg font-bold text-red-700">Order support requested</h2>
              <p className="text-sm text-red-700 mt-2">
                We prefilled your help request for a late order{issueOrderId ? ` (${issueOrderId})` : ''}.
                You can submit it directly from the contact form on this page.
              </p>
            </div>
          )}
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>

          {filteredGroups.length === 0 && (
            <p className="text-gray-500">No help topics match “{searchQuery}”.</p>
          )}

          {filteredGroups.map((group) => (
            <div key={group.groupTitle}>
              <div className="flex items-center gap-3 mb-4">
                <InfoIconBadge
                  iconKey={groupIcons[group.groupTitle] || 'help'}
                  tone="red"
                  size="sm"
                />
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                  {group.groupTitle}
                </h3>
              </div>
              <div className="space-y-3">
                {group.questions.map((item) => {
                  const isOpen = openQuestionId === item.questionId
                  return (
                    <article
                      key={item.questionId}
                      className="border border-gray-200 rounded-xl bg-white overflow-hidden"
                    >
                      <button
                        type="button"
                        className="w-full text-left px-4 py-4 flex items-center justify-between gap-3"
                        onClick={() => toggleQuestion(item.questionId)}
                      >
                        <span className="font-medium">{item.questionText}</span>
                        <span className="text-red-600 text-xl leading-none">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                          {item.answerText}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-100 p-5 bg-white shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <InfoIconBadge iconKey="support" tone="red" size="md" />
              <h3 className="font-bold text-lg">Still need help?</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Send a message and include your order number if you have one.
            </p>

            {formSent ? (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Message sent. Our support team will reply to your email.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-4">
                <FormField
                  fieldId="help_name"
                  labelText="Your name"
                  fieldValue={contactName}
                  onChange={setContactName}
                  validateFn={(v) => (!v.trim() ? 'Name is required' : '')}
                />
                <FormField
                  fieldId="help_email"
                  labelText="Email"
                  fieldType="email"
                  fieldValue={contactEmail}
                  onChange={setContactEmail}
                  validateFn={(v) => {
                    if (!v.trim()) return 'Email is required'
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email'
                    return ''
                  }}
                />
                <div className="mb-4">
                  <label htmlFor="help_message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="help_message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="mi-field w-full px-3 py-2 rounded-lg text-sm"
                    placeholder="Describe your issue..."
                  />
                </div>
                <CtaButton ctaButtonId="help_send_message" type="submit" className="w-full rounded-lg">
                  Send message
                </CtaButton>
              </form>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold">Contact details</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Email: support@quickbite.demo</li>
              <li>Hours: 8am – 11pm, 7 days a week</li>
              <li>Average reply time: under 1 hour</li>
            </ul>
          </div>
        </aside>
      </main>

      <SiteFooter />
    </div>
  )
}

export default HelpCentrePage
