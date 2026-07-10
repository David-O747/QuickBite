import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import CheckoutProgress from '../components/CheckoutProgress'

const DELIVERY_FEE = 2.99
const SERVICE_FEE = 1.5

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
    </svg>
  )
}

function BasketPage() {
  const app = useApp()
  const navigate = useNavigate()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoMessage, setPromoMessage] = useState('')

  const promoDiscount = useMemo(() => {
    if (appliedPromo === 'WELCOME10' && app.basketTotal >= 30) return 10
    return 0
  }, [appliedPromo, app.basketTotal])

  const orderTotal = app.basketTotal + DELIVERY_FEE + SERVICE_FEE - promoDiscount

  function handleCheckout() {
    if (!app.isLoggedIn) {
      navigate('/login')
      return
    }
    sessionStorage.setItem('qb_promo', appliedPromo)
    navigate('/checkout/delivery')
  }

  function applyPromoCode() {
    const code = promoInput.trim().toUpperCase()

    if (code === 'WELCOME10') {
      if (app.basketTotal >= 30) {
        setAppliedPromo('WELCOME10')
        setPromoMessage('£10 off applied with WELCOME10')
      } else {
        setAppliedPromo('')
        setPromoMessage('WELCOME10 works on orders over £30')
      }
      return
    }

    setAppliedPromo('')
    setPromoMessage(code ? 'Promo code not recognised' : 'Enter a promo code')
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteHeader pageVariant="basket" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <CheckoutProgress currentStepKey="basket" />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Your Basket</h1>
          {app.basketRestaurantName && app.basketItems.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              From {app.basketRestaurantName}
            </p>
          )}
        </div>

        {app.basketItems.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-gray-100 bg-gray-50">
            <p className="text-gray-600 mb-4">Your basket is empty.</p>
            <Link to="/">
              <CtaButton ctaButtonId="basket_browse" className="rounded-full">
                Find restaurants
              </CtaButton>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {app.basketItems.map((item) => (
                <article
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <img
                    src={item.imagePath}
                    alt={item.productName}
                    className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-gray-900">{item.productName}</h2>
                        {item.productDescription && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.productDescription}
                          </p>
                        )}
                      </div>
                      <p className="text-red-600 font-bold shrink-0">
                        £{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 inline-flex items-center bg-gray-100 rounded-full">
                      <CtaButton
                        ctaButtonId={`qty_down_${item.productId}`}
                        className="!bg-transparent !text-gray-800 !px-3 !py-1.5 !rounded-full !shadow-none min-w-10"
                        onClick={() => app.updateBasketQuantity(item.productId, -1)}
                      >
                        −
                      </CtaButton>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <CtaButton
                        ctaButtonId={`qty_up_${item.productId}`}
                        className="!bg-transparent !text-gray-800 !px-3 !py-1.5 !rounded-full !shadow-none min-w-10"
                        onClick={() => app.updateBasketQuantity(item.productId, 1)}
                      >
                        +
                      </CtaButton>
                    </div>
                  </div>
                </article>
              ))}

            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold">Order Summary</h2>
                  <Link to="/info/about-us" className="text-xs text-red-600 font-medium">
                    How ordering works
                  </Link>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>£{app.basketTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>£{DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>£{SERVICE_FEE.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>WELCOME10</span>
                      <span>-£{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-red-600">
                    £{orderTotal.toFixed(2)}
                  </span>
                </div>

                <CtaButton
                  ctaButtonId="proceed_checkout"
                  className="w-full mt-5 rounded-xl py-3 text-base"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout →
                </CtaButton>

                <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <ShieldIcon />
                  Secure payment powered by QuickPay
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                  <CtaButton
                    ctaButtonId="basket_apply_promo"
                    className="!bg-transparent !text-red-600 !px-3 !py-2 !shadow-none shrink-0"
                    onClick={applyPromoCode}
                  >
                    Apply
                  </CtaButton>
                </div>
                {promoMessage && (
                  <p className="text-xs text-gray-500 mt-2">{promoMessage}</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default BasketPage
