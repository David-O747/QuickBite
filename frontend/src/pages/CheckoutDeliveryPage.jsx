import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import FormField from '../components/FormField'
import CheckoutProgress from '../components/CheckoutProgress'
import CheckoutOrderSummary from '../components/CheckoutOrderSummary'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  validateCardNumber,
  validateCvv,
  validateExpiry,
  validatePostcode,
  validateRequired,
} from '../utils/validators'
import {
  calculateOrderTotal,
  calculatePromoDiscount,
  DELIVERY_FEE,
  getStoredPromoCode,
  SERVICE_FEE,
} from '../utils/checkoutFees'
import { endTaskTimer, getStudyMeta, startTaskTimer } from '../tracking/trackingService'
import { createOrder } from '../api/orderApi'
import { STUDY_CHECKOUT_PREFILL } from '../study/studySession'

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" aria-hidden="true">
      <path d="M3 17h2m14 0h2M5 17H3V7h12v10M5 17v-3h10v3" />
      <path d="M17 17V11h3l2 3v3h-5z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

const FORM_ID = 'secure-checkout-form'

function CheckoutDeliveryPage() {
  const navigate = useNavigate()
  const app = useApp()
  const isPlacingOrder = useRef(false)

  const [fullName, setFullName] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const promoCode = getStoredPromoCode()
  const promoDiscount = useMemo(
    () => calculatePromoDiscount(app.basketTotal, promoCode),
    [app.basketTotal, promoCode]
  )
  const orderTotal = useMemo(
    () => calculateOrderTotal(app.basketTotal, promoCode),
    [app.basketTotal, promoCode]
  )

  useEffect(() => {
    startTaskTimer('complete_checkout')
  }, [])

  useEffect(() => {
    if (isPlacingOrder.current) return
    if (app.basketItems.length === 0) navigate('/basket')
  }, [app.basketItems.length, navigate])

  useEffect(() => {
    if (app.isStudySession) {
      setFullName(STUDY_CHECKOUT_PREFILL.fullName)
      setStreetAddress(STUDY_CHECKOUT_PREFILL.streetAddress)
      setCity(STUDY_CHECKOUT_PREFILL.city)
      setPostcode(STUDY_CHECKOUT_PREFILL.postcode)
      setPhoneNumber(STUDY_CHECKOUT_PREFILL.phoneNumber)
      setCardNumber('')
      setCardExpiry('')
      setCardCvv('')
      return
    }

    if (!app.isLoggedIn || !app.customer?.id) {
      setFullName('')
      setStreetAddress('')
      setCity('')
      setPostcode('')
      setPhoneNumber('')
      return
    }

    let saved = app.getSavedDeliveryDetails()
    if (!saved) {
      try {
        const legacy = JSON.parse(sessionStorage.getItem('qb_delivery') || 'null')
        if (legacy) {
          app.saveDeliveryDetails(legacy)
          saved = legacy
          sessionStorage.removeItem('qb_delivery')
        }
      } catch {
      }
    }

    if (saved) {
      setFullName(saved.fullName || '')
      setStreetAddress(saved.streetAddress || '')
      setCity(saved.city || '')
      setPostcode(saved.postcode || '')
      setPhoneNumber(saved.phoneNumber || '')
      return
    }

    setFullName('')
    setStreetAddress('')
    setCity('')
    setPostcode('')
    setPhoneNumber('')
  }, [app.isStudySession, app.isLoggedIn, app.customer?.id])

  async function handlePlaceOrder(event) {
    if (event?.preventDefault) event.preventDefault()
    setSubmitAttempted(true)
    setFormError('')

    const errors = [
      validateRequired(fullName, 'Full name'),
      validateRequired(streetAddress, 'Street address'),
      validateRequired(city, 'City'),
      validatePostcode(postcode),
      validateRequired(phoneNumber, 'Phone number'),
      validateCardNumber(cardNumber),
      validateExpiry(cardExpiry),
      validateCvv(cardCvv),
    ].filter(Boolean)

    if (errors.length > 0) {
      setFormError(errors[0] || 'Please fix the highlighted fields before continuing.')
      return
    }

    if (app.basketItems.length === 0) {
      setFormError('Your basket is empty. Add items before placing an order.')
      navigate('/basket')
      return
    }

    isPlacingOrder.current = true
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const deliveryDetails = { fullName, streetAddress, city, postcode, phoneNumber }
      app.saveDeliveryDetails(deliveryDetails)

      const backendOrder = await createOrder({
        participant_id: app.participantId,
        age_group: app.ageGroup,
        session_id: app.sessionId,
        restaurant_name: app.basketRestaurantName || '',
        items: app.basketItems,
        subtotal: app.basketTotal,
        delivery_fee: DELIVERY_FEE,
        service_fee: SERVICE_FEE,
        promo_discount: promoDiscount,
        total: orderTotal,
        promo_code: promoCode,
        delivery_details: deliveryDetails,
        contact_email: app.customer?.customerEmail || '',
        contact_phone: phoneNumber,
        card_last_four: cardNumber.replace(/\s/g, '').slice(-4),
        customer_id: app.customer?.id || null,
      })

      app.placeOrder({
        deliveryDetails,
        contactEmail: app.customer?.customerEmail || '',
        contactPhone: phoneNumber,
        paymentDetails: {
          cardLastFour: cardNumber.replace(/\s/g, '').slice(-4),
        },
        orderSubtotal: app.basketTotal,
        deliveryFee: DELIVERY_FEE,
        serviceFee: SERVICE_FEE,
        promoDiscount,
        orderTotal,
        promoCode,
        backendOrderId: backendOrder.order?.id,
        trackingPublicId: backendOrder.order?.tracking_public_id,
        supportPhone: backendOrder.order?.support_phone,
        backendStatus: backendOrder.order?.status,
        estimatedArrival: backendOrder.order?.estimated_arrival_label,
      })

      endTaskTimer('complete_checkout', getStudyMeta(app))
      navigate('/order-confirmation')
    } catch {
      isPlacingOrder.current = false
      setIsLoading(false)
      setFormError('Could not place order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader pageVariant="checkout" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <CheckoutProgress currentStepKey="payment" />

        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">Secure Checkout</h1>
        </div>

        <p className="text-sm text-gray-500 mb-6 max-w-2xl">
          Enter your delivery and payment details, then place your order.
        </p>

        {formError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <form id={FORM_ID} onSubmit={handlePlaceOrder} noValidate autoComplete="off">
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <TruckIcon />
                    <h2 className="text-lg font-bold">Delivery Address</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-4">
                    <div className="sm:col-span-2">
                      <FormField
                        fieldId="delivery_name"
                        labelText="Full Name"
                        fieldValue={fullName}
                        onChange={setFullName}
                        validateFn={(v) => validateRequired(v, 'Full name')}
                        placeholder="e.g. Alex Johnson"
                        autoComplete="name"
                        submitAttempted={submitAttempted}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        fieldId="delivery_address"
                        labelText="Street Address"
                        fieldValue={streetAddress}
                        onChange={setStreetAddress}
                        validateFn={(v) => validateRequired(v, 'Street address')}
                        placeholder="123 Main Street"
                        autoComplete="street-address"
                        submitAttempted={submitAttempted}
                      />
                    </div>
                    <FormField
                      fieldId="delivery_city"
                      labelText="City"
                      fieldValue={city}
                      onChange={setCity}
                      validateFn={(v) => validateRequired(v, 'City')}
                      placeholder="London"
                      autoComplete="address-level2"
                      submitAttempted={submitAttempted}
                    />
                    <FormField
                      fieldId="delivery_postcode"
                      labelText="Postcode"
                      fieldValue={postcode}
                      onChange={setPostcode}
                      validateFn={validatePostcode}
                      placeholder="SW1A 1AA"
                      autoComplete="postal-code"
                      submitAttempted={submitAttempted}
                    />
                    <div className="sm:col-span-2">
                      <FormField
                        fieldId="delivery_phone"
                        labelText="Phone Number"
                        fieldValue={phoneNumber}
                        onChange={setPhoneNumber}
                        validateFn={(v) => validateRequired(v, 'Phone number')}
                        placeholder="+44 7..."
                        autoComplete="tel"
                        submitAttempted={submitAttempted}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mt-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CardIcon />
                    <h2 className="text-lg font-bold">Payment Method</h2>
                  </div>

                  <FormField
                    fieldId="demo_number"
                    labelText="Card Number"
                    fieldValue={cardNumber}
                    onChange={setCardNumber}
                    validateFn={validateCardNumber}
                    placeholder="Card number"
                    autoComplete="off"
                    submitAttempted={submitAttempted}
                  />

                  <div className="grid sm:grid-cols-2 gap-x-4">
                    <FormField
                      fieldId="demo_expiry"
                      labelText="Expiry Date"
                      fieldValue={cardExpiry}
                      onChange={setCardExpiry}
                      validateFn={validateExpiry}
                      placeholder="MM/YY"
                      autoComplete="off"
                      submitAttempted={submitAttempted}
                    />
                    <FormField
                      fieldId="demo_code"
                      labelText="Security Code"
                      fieldValue={cardCvv}
                      onChange={setCardCvv}
                      validateFn={validateCvv}
                      placeholder="123"
                      autoComplete="off"
                      submitAttempted={submitAttempted}
                    />
                  </div>
                </section>
              </form>
            </div>

            <CheckoutOrderSummary
              basketItems={app.basketItems}
              subtotal={app.basketTotal}
              promoDiscount={promoDiscount}
              orderTotal={orderTotal}
              isLoading={isLoading}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default CheckoutDeliveryPage
