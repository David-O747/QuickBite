import { useApp } from '../context/AppContext'
import { localPhotos } from '../data/homeContent'

function CartDrawer({ isOpen, onClose, onBrowse }) {
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    welcomeCodeClaimed,
    updateCartQuantity,
    removeFromCart,
  } = useApp()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-bold text-lg">Your basket</h3>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500 hover:text-red-600">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <img src={localPhotos.basketIcon} alt="" className="w-12 h-12 mx-auto opacity-40" />
              <p className="mt-4 text-gray-600">Your basket is empty</p>
              <button
                type="button"
                onClick={onBrowse}
                className="mt-4 qb-btn bg-red-600 text-white px-5 py-2 rounded-full text-sm"
              >
                Browse restaurants
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.cartLineId} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.dishName}</p>
                      <p className="text-xs text-gray-500">{item.restaurantName}</p>
                    </div>
                    <p className="font-medium">£{(item.dishPrice * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="qb-btn w-7 h-7 border rounded" onClick={() => updateCartQuantity(item.cartLineId, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" className="qb-btn w-7 h-7 border rounded" onClick={() => updateCartQuantity(item.cartLineId, 1)}>+</button>
                    </div>
                    <button type="button" className="text-red-600 text-sm" onClick={() => removeFromCart(item.cartLineId)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>£{cartSubtotal.toFixed(2)}</span></div>
            {welcomeCodeClaimed && cartDiscount > 0 && (
              <div className="flex justify-between text-green-600"><span>WELCOME10</span><span>-£{cartDiscount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>£{cartTotal.toFixed(2)}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
