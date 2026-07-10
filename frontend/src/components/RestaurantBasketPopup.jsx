import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getRestaurantFromStorage, saveRestaurantToStorage } from '../data/restaurantMenus'
import CtaButton from './CtaButton'
import PopupIcon from './studyPopups/PopupIcon'

function RestaurantBasketPopup({
  isOpen,
  newRestaurantName = '',
  onClose,
  onClearedBasket,
}) {
  const app = useApp()
  const navigate = useNavigate()

  if (!isOpen || !app.basketRestaurantId) return null

  function goToCurrentRestaurantMenu() {
    const savedRestaurant = getRestaurantFromStorage(app.basketRestaurantId)
    if (savedRestaurant) saveRestaurantToStorage(savedRestaurant)
    navigate(`/restaurant/${encodeURIComponent(app.basketRestaurantId)}`)
    onClose()
  }

  function goToBasket() {
    navigate('/basket')
    onClose()
  }

  function clearBasketAndContinue() {
    app.clearBasket()
    onClose()
    if (onClearedBasket) onClearedBasket()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="bg-red-600 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <PopupIcon iconId="lucide:shopping-bag" size={22} color="ffffff" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-red-100">One restaurant per order</p>
                <h3 className="text-xl font-bold mt-1">Finish your current order first</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-white/80"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Your basket</p>
            <p className="font-bold text-gray-900 mt-1">{app.basketRestaurantName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {app.basketItemCount} {app.basketItemCount === 1 ? 'item' : 'items'} · £{app.basketTotal.toFixed(2)}
            </p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            You can only order from one restaurant at a time.
            {newRestaurantName ? (
              <>
                {' '}Please finish or clear your basket from{' '}
                <span className="font-semibold text-gray-900">{app.basketRestaurantName}</span>
                {' '}before ordering from{' '}
                <span className="font-semibold text-gray-900">{newRestaurantName}</span>.
              </>
            ) : (
              <>
                {' '}Please finish checkout or clear your basket before starting a new order.
              </>
            )}
          </p>

          <div className="space-y-2 pt-1">
            <CtaButton
              ctaButtonId="popup_view_basket"
              className="w-full rounded-lg"
              onClick={goToBasket}
            >
              View basket &amp; checkout
            </CtaButton>

            <CtaButton
              ctaButtonId="popup_back_restaurant"
              className="w-full rounded-lg !bg-gray-800"
              onClick={goToCurrentRestaurantMenu}
            >
              Back to {app.basketRestaurantName}
            </CtaButton>

            {newRestaurantName && (
              <CtaButton
                ctaButtonId="popup_clear_basket"
                className="w-full rounded-lg !bg-white !text-red-600 border-2 border-red-600"
                onClick={clearBasketAndContinue}
              >
                Clear basket &amp; order from {newRestaurantName}
              </CtaButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantBasketPopup
