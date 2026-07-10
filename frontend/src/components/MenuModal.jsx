import { buildMenuForRestaurant } from '../data/menuItems'
import { useApp } from '../context/AppContext'

function MenuModal({ restaurant, restaurantKey, photoUrl, isOpen, onClose }) {
  const { addToCart } = useApp()

  if (!isOpen || !restaurant) return null

  const menuItems = buildMenuForRestaurant(restaurant, restaurantKey)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <div className="relative h-40 bg-gray-100 shrink-0">
          {photoUrl && <img src={photoUrl} alt="" className="w-full h-full object-cover" />}
          <button type="button" onClick={onClose} className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 shadow">×</button>
        </div>

        <div className="p-5 overflow-y-auto">
          <h3 className="text-xl font-bold">{restaurant.restaurantName}</h3>
          <p className="text-sm text-gray-500 mt-1">{restaurant.cuisineLabel}</p>

          <ul className="mt-5 space-y-3">
            {menuItems.map((dish) => (
              <li key={dish.cartLineId} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="font-medium">{dish.dishName}</p>
                  <p className="text-sm text-red-600">£{dish.dishPrice.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="qb-btn bg-red-600 text-white px-4 py-2 rounded-full text-sm shrink-0"
                  onClick={() => addToCart(dish)}
                >
                  Add to cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MenuModal
