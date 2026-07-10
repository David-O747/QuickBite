import CtaButton from './CtaButton'
import { DELIVERY_FEE, SERVICE_FEE } from '../utils/checkoutFees'

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="inline mr-2 -mt-0.5">
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
  )
}

function CheckoutOrderSummary({
  basketItems,
  subtotal,
  promoDiscount,
  orderTotal,
  isLoading,
  onPlaceOrder,
}) {
  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

      <ul className="space-y-4 mb-5">
        {basketItems.map((item) => (
          <li key={item.productId} className="flex gap-3">
            <img
              src={item.imagePath}
              alt={item.productName}
              className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 leading-snug">{item.productName}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 shrink-0">
              £{(item.unitPrice * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
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
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-bold text-red-600">£{orderTotal.toFixed(2)}</span>
      </div>

      <CtaButton
        ctaButtonId="place_order"
        type="button"
        disabled={isLoading}
        className="w-full mt-5 rounded-xl py-3.5 text-base flex items-center justify-center"
        onClick={onPlaceOrder}
      >
        <CartIcon />
        Place Order
      </CtaButton>

      <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1.5">
        <LockIcon />
        Secure Encrypted Transaction
      </p>
    </aside>
  )
}

export default CheckoutOrderSummary
