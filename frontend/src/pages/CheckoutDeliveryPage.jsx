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
import CtaButton from '../components/CtaButton'
import { endTaskTimer, getStudyMeta } from '../tracking/trackingService'
import { createOrder } from '../api/orderApi'

const DEMO_CARD = {
  number: '4242 4242 4242 4242',
  expiry: '12/30',
  cvv: '123',
}

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

  const promoCode = getStoredPromoCode()
  const promoDiscount = useMemo(
    () => calculatePromoDiscount(app.basketTotal, promoCode),
    [app.basketTotal, promoCode]
  )
  const orderTotal = useMemo(
    () => calculateOrderTotal(app.basketTotal, promoCode),
    [app.basketTotal, promoCode]
  )

  // Keep shoppers on checkout while placing order — clearing the basket must not bounce back to /basket
  useEffect(() => {
    if (isPlacingOrder.current) return
    if (app.basketItems.length === 0) navigate('/basket')
  }, [app.basketItems.length, navigate])

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('qb_delivery') || 'null')
    if (saved) {
      setFullName(saved.fullName || '')
      setStreetAddress(saved.streetAddress || '')
      setCity(saved.city || '')
      setPostcode(saved.postcode || '')
      setPhoneNumber(saved.phoneNumber || '')
    }
  }, [])

  async function handlePlaceOrder(event) {
    if (event?.preventDefault) event.preventDefault()
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
      setFormError(errors[0])
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
      sessionStorage.setItem('qb_delivery', JSON.stringify(deliveryDetails))

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
          Demo checkout only — no real payment is taken. Fill the form or use the demo card,
          then Place Order to open the confirmation page.
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
              <form id={FORM_ID} onSubmit={handlePlaceOrder}>
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
                    />
                    <FormField
                      fieldId="delivery_postcode"
                      labelText="Postcode"
                      fieldValue={postcode}
                      onChange={setPostcode}
                      validateFn={validatePostcode}
                      placeholder="SW1A 1AA"
                      autoComplete="postal-code"
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
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm mt-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <CardIcon />
                      <h2 className="text-lg font-bold">Payment Method</h2>
                    </div>
                    <CtaButton
                      ctaButtonId="fill_demo_card"
                      type="button"
                      className="bg-white! text-red-600! border border-red-600 px-3! py-1.5! text-xs rounded-lg"
                      onClick={() => {
                        setCardNumber(DEMO_CARD.number)
                        setCardExpiry(DEMO_CARD.expiry)
                        setCardCvv(DEMO_CARD.cvv)
                        setFormError('')
                      }}
                    >
                      Fill demo card
                    </CtaButton>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Mock card only. Example: 4242 4242 4242 4242 · 12/30 · 123 — no charge.
                  </p>

                  <FormField
                    fieldId="demo_number"
                    labelText="Demo Payment Number"
                    fieldValue={cardNumber}
                    onChange={setCardNumber}
                    validateFn={validateCardNumber}
                    placeholder="4242 4242 4242 4242"
                    autoComplete="new-password"
                  />

                  <div className="grid sm:grid-cols-2 gap-x-4">
                    <FormField
                      fieldId="demo_expiry"
                      labelText="Demo Expiry"
                      fieldValue={cardExpiry}
                      onChange={setCardExpiry}
                      validateFn={validateExpiry}
                      placeholder="MM/YY"
                      autoComplete="new-password"
                    />
                    <FormField
                      fieldId="demo_code"
                      labelText="Demo Security Code"
                      fieldValue={cardCvv}
                      onChange={setCardCvv}
                      validateFn={validateCvv}
                      placeholder="123"
                      autoComplete="new-password"
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
