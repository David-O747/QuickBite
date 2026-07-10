import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import CheckoutProgress from '../components/CheckoutProgress'
import SuccessBanner from '../components/SuccessBanner'
import PopupIcon from '../components/studyPopups/PopupIcon'
import { getStudyMeta, logPostOrderFeedback } from '../tracking/trackingService'
import { createOrderHelpRequest, getOrderByTrackingId } from '../api/orderApi'
import {
  getDeliveryProgressPercent,
  getDeliveryStage,
  getDeliveryStageInfo,
} from '../utils/deliveryStage'

const deliverySteps = ['Confirmed', 'Preparing', 'On the way', 'Delivered']
const FEEDBACK_MODAL_DELAY_MS = 5000

function ScooterIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="text-gray-300">
      <circle cx="14" cy="48" r="8" stroke="currentColor" strokeWidth="3" />
      <circle cx="46" cy="48" r="8" stroke="currentColor" strokeWidth="3" />
      <path d="M22 48h18M30 24l8 8h8l4 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 32h8l4 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function TrackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="inline mr-2 -mt-0.5">
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function RatingRow({ questionText, lowLabel, highLabel, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">{questionText}</p>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((ratingValue) => (
          <button
            key={ratingValue}
            type="button"
            data-no-misclick
            className={`min-w-10 h-10 rounded-full border text-sm font-semibold ${
              value === ratingValue
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-gray-300 text-gray-700'
            }`}
            onClick={() => onChange(ratingValue)}
          >
            {ratingValue}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1.5 px-0.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

function FeedbackModal({
  isOpen,
  smoothnessRating,
  paymentClarityRating,
  feedbackText,
  setSmoothnessRating,
  setPaymentClarityRating,
  setFeedbackText,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null

  return (
    <div
      className="study-feedback-modal fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-linear-to-r from-red-50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-red-100 flex items-center justify-center shadow-sm">
                <PopupIcon iconId="lucide:clipboard-list" size={28} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Quick feedback</p>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">How was your checkout?</h2>
                <p className="text-sm text-gray-500 mt-1">Two short ratings — takes under a minute.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-gray-400"
              aria-label="Close"
              data-no-misclick
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <RatingRow
            questionText="1. Overall, how easy was it to complete your purchase?"
            lowLabel="1 — Very difficult"
            highLabel="5 — Very easy"
            value={smoothnessRating}
            onChange={setSmoothnessRating}
          />

          <RatingRow
            questionText="2. How clear was the checkout and payment process?"
            lowLabel="1 — Not clear at all"
            highLabel="5 — Very clear"
            value={paymentClarityRating}
            onChange={setPaymentClarityRating}
          />

          <div>
            <label htmlFor="post_order_feedback" className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
              <PopupIcon iconId="lucide:message-square-text" size={18} color="6b7280" />
              3. Anything that felt confusing or slowed you down? (optional)
            </label>
            <textarea
              id="post_order_feedback"
              rows="4"
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              placeholder="Optional comments..."
            />
          </div>

          <div className="flex gap-3">
            <CtaButton ctaButtonId="feedback_submit" className="flex-1 rounded-lg" onClick={onSubmit}>
              Submit
            </CtaButton>
            <CtaButton
              ctaButtonId="feedback_skip"
              className="flex-1 rounded-lg bg-white! text-gray-700! border border-gray-200"
              onClick={onClose}
            >
              Skip
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderConfirmationPage() {
  const app = useApp()
  const { lastOrder, updateOrderInHistory } = app
  const navigate = useNavigate()
  const [showCheck] = useState(true)
  const [trackHighlight, setTrackHighlight] = useState(false)
  const [feedbackThanksText, setFeedbackThanksText] = useState('')
  const [liveBackendOrder, setLiveBackendOrder] = useState(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [smoothnessRating, setSmoothnessRating] = useState(0)
  const [paymentClarityRating, setPaymentClarityRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const liveTrackRef = useRef(null)

  const [elapsedMs, setElapsedMs] = useState(0)
  useEffect(() => {
    if (!lastOrder) return
    const placedAtMs = new Date(lastOrder.placedAt).getTime()
    const tick = () => setElapsedMs(Date.now() - placedAtMs)
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [lastOrder])

  const deliveryStage = useMemo(
    () => getDeliveryStage(lastOrder, elapsedMs),
    [lastOrder, elapsedMs]
  )

  const stageInfo = useMemo(
    () => getDeliveryStageInfo(lastOrder, deliveryStage),
    [lastOrder, deliveryStage]
  )

  const progressPercent = useMemo(
    () => getDeliveryProgressPercent(deliveryStage),
    [deliveryStage]
  )

  useEffect(() => {
    if (!lastOrder) return

    const feedbackKey = `qb_feedback_done_${lastOrder.orderNumber}`
    if (sessionStorage.getItem(feedbackKey) === '1') return

    const timer = window.setTimeout(() => {
      setShowFeedbackModal(true)
    }, FEEDBACK_MODAL_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [lastOrder])

  useEffect(() => {
    if (!lastOrder?.trackingPublicId) return

    let active = true
    async function refresh() {
      try {
        const data = await getOrderByTrackingId(lastOrder.trackingPublicId)
        if (!active) return
        setLiveBackendOrder(data.order)
        if (data.order?.status && lastOrder?.orderNumber) {
          updateOrderInHistory(lastOrder.orderNumber, { backendStatus: data.order.status })
        }
      } catch {
      }
    }

    refresh()
    const timer = window.setInterval(refresh, 4000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [lastOrder?.trackingPublicId])

  function focusLiveTrack() {
    setTrackHighlight(true)
    liveTrackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => setTrackHighlight(false), 2000)
  }

  function closeFeedbackModal() {
    if (lastOrder) {
      sessionStorage.setItem(`qb_feedback_done_${lastOrder.orderNumber}`, '1')
    }
    setShowFeedbackModal(false)
  }

  function submitFeedback() {
    if (!lastOrder) return
    if (!smoothnessRating || !paymentClarityRating) return

    logPostOrderFeedback(
      {
        orderNumber: lastOrder.orderNumber,
        smoothnessRating,
        paymentClarityRating,
        feedbackText: feedbackText.trim(),
      },
      getStudyMeta(app)
    )
    closeFeedbackModal()
    setFeedbackThanksText('Thanks — your feedback was submitted.')
    setSmoothnessRating(0)
    setPaymentClarityRating(0)
    setFeedbackText('')
    window.setTimeout(() => setFeedbackThanksText(''), 2600)
  }

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader pageVariant="confirm" />
        <main className="max-w-xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">No order found. Place a demo order from checkout first.</p>
          <Link to="/">
            <CtaButton ctaButtonId="confirm_browse">Browse menu</CtaButton>
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const { deliveryDetails } = lastOrder
  const randomSupportPhone = useMemo(
    () => `07${Math.floor(100000000 + Math.random() * 900000000)}`,
    []
  )
  const supportPhone = liveBackendOrder?.support_phone || lastOrder.supportPhone || randomSupportPhone

  const courierMapLeft = ['18%', '38%', '62%', '78%'][deliveryStage]

  async function openLateOrderHelp() {
    if (lastOrder?.trackingPublicId) {
      try {
        await createOrderHelpRequest(lastOrder.trackingPublicId, {
          issue_type: 'late-order',
          message: `Customer flagged late order on confirmation page (${lastOrder.orderNumber}).`,
        })
      } catch {
      }
    }
    navigate(
      `/info/help-centre?issue=late-order&order_id=${encodeURIComponent(lastOrder.orderNumber)}`
    )
  }
  const addressLine = [
    deliveryDetails?.streetAddress,
    deliveryDetails?.city,
    deliveryDetails?.postcode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader pageVariant="confirm" />
      <FeedbackModal
        isOpen={showFeedbackModal}
        smoothnessRating={smoothnessRating}
        paymentClarityRating={paymentClarityRating}
        feedbackText={feedbackText}
        setSmoothnessRating={setSmoothnessRating}
        setPaymentClarityRating={setPaymentClarityRating}
        setFeedbackText={setFeedbackText}
        onSubmit={submitFeedback}
        onClose={closeFeedbackModal}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <CheckoutProgress currentStepKey="confirm" />

        <div className="text-center mb-10">
          <div
            className={`mi-check-icon mx-auto w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg ${
              showCheck ? 'mi-visible' : ''
            }`}
          >
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-6">Order placed successfully!</h1>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Sit back and relax. We&apos;ve received your order and the kitchen is already heating up the stove.
          </p>

          <p className="mt-4 text-sm font-medium text-gray-700">
            Order number{' '}
            <span className="font-bold text-gray-900">#{lastOrder.orderNumber}</span>
          </p>

          <div className="mt-5 mx-auto max-w-md rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-center gap-3 text-sm text-green-800">
            <PopupIcon iconId="lucide:mail-check" size={22} color="15803d" />
            <span>Your order confirmation has been sent to your email.</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto mb-6">
          <SuccessBanner
            isVisible={Boolean(feedbackThanksText)}
            messageText={feedbackThanksText}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                  <PopupIcon iconId="lucide:clock" size={14} />
                  {deliveryStage < 3 ? 'Estimated Arrival' : 'Delivery Status'}
                </p>
                <p className="text-3xl font-bold mt-1">{stageInfo.headline}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{stageInfo.status}</p>
                <p className="text-sm text-gray-500 mt-1">{stageInfo.detail}</p>
              </div>
              <ScooterIcon />
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-6">
                <PopupIcon iconId="lucide:map-pin" size={22} color="b45309" />
                <div>
                  <h2 className="font-bold">Delivery Address</h2>
                  <p className="font-medium mt-1">{deliveryDetails?.fullName}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{addressLine}</p>
                </div>
              </div>

              <div className="relative pt-2">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                <div
                  className="absolute top-5 left-0 h-1 bg-red-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
                <div className="relative flex justify-between">
                  {deliverySteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center w-1/4">
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-700 ${
                          index <= deliveryStage ? 'bg-red-600 ring-4 ring-red-100' : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={`mt-3 text-xs text-center ${
                          index <= deliveryStage ? 'font-semibold text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              ref={liveTrackRef}
              className={`rounded-2xl border bg-white overflow-hidden shadow-sm ${
                trackHighlight ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-100'
              }`}
            >
              <div className="relative h-48 bg-linear-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="grid grid-cols-6 grid-rows-4 h-full gap-1 p-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="bg-gray-600 rounded-sm" style={{ opacity: 0.3 + (i % 5) * 0.1 }} />
                    ))}
                  </div>
                </div>
                {deliveryStage < 2 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="track-map-spinner border-white/30 border-t-white w-8 h-8 border-2 rounded-full" />
                  </div>
                )}
                <div
                  className={`absolute top-1/2 -translate-y-full transition-all duration-1000 ease-in-out ${
                    deliveryStage === 2 ? 'track-courier-pulse' : ''
                  }`}
                  style={{ left: courierMapLeft }}
                >
                  <MapPinIcon />
                  <div className="track-courier-dot w-4 h-4 bg-red-600 rounded-full border-2 border-white -mt-1 mx-auto" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <CtaButton
                    ctaButtonId="view_live_track"
                    className="rounded-lg bg-white/90! text-gray-900! text-sm"
                    onClick={focusLiveTrack}
                  >
                    <TrackIcon />
                    View Live Track
                  </CtaButton>
                </div>
              </div>
              <p className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                Live track — {deliverySteps[deliveryStage]}
              </p>
            </section>

            <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <PopupIcon iconId="lucide:headphones" size={22} />
                Need help with this order?
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                If your order is late, missing, or not delivered, contact support or open Get Help.
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <CtaButton
                  ctaButtonId="order_call_restaurant"
                  className="rounded-lg"
                  onClick={() => window.alert(`Call support: ${supportPhone}`)}
                >
                  Call support ({supportPhone})
                </CtaButton>
                <CtaButton
                  ctaButtonId="order_get_help"
                  className="rounded-lg bg-white! text-red-600! border border-red-200"
                  onClick={openLateOrderHelp}
                >
                  Get Help
                </CtaButton>
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold mb-5">Order Summary</h2>

            <ul className="space-y-4 mb-5">
              {lastOrder.orderItems.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <img
                    src={item.imagePath}
                    alt={item.productName}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug">
                      {item.quantity > 1 ? `${item.quantity}x ` : ''}
                      {item.productName}
                    </p>
                    {item.productDescription && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.productDescription}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    £{(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>£{(lastOrder.orderSubtotal ?? lastOrder.orderTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>£{(lastOrder.deliveryFee ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span>£{(lastOrder.serviceFee ?? 0).toFixed(2)}</span>
              </div>
              {(lastOrder.promoDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{lastOrder.promoCode || 'Promo'}</span>
                  <span>-£{lastOrder.promoDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
              <span className="font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-red-600">
                £{lastOrder.orderTotal.toFixed(2)}
              </span>
            </div>

            <CtaButton
              ctaButtonId="track_order"
              className="w-full mt-5 rounded-xl py-3.5 text-base"
              onClick={focusLiveTrack}
            >
              <TrackIcon />
              Track Order
            </CtaButton>

            <Link to="/" className="block mt-3">
              <CtaButton
                ctaButtonId="confirm_home"
                className="w-full rounded-xl py-3.5 text-base bg-white! text-red-600! border-2 border-red-600"
              >
                ← Back to Home
              </CtaButton>
            </Link>

            <p className="mt-5 text-xs text-gray-400 text-center">
              Order ID: #{lastOrder.orderNumber}
            </p>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default OrderConfirmationPage
