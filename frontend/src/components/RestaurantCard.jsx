import { useApp } from '../context/AppContext'

function RestaurantCard({ restaurant, photoUrl, restaurantKey, isSpotlighted, onOpenMenu, onCardClick }) {
  const { favoriteIds, toggleFavorite, showToast } = useApp()
  const isFavorited = favoriteIds.has(restaurantKey)

  function handleFavoriteClick(event) {
    event.stopPropagation()
    toggleFavorite(restaurantKey)
    showToast(isFavorited ? 'Removed from favourites' : 'Added to favourites')
  }

  return (
    <article
      id={`restaurant-${restaurantKey}`}
      role="button"
      tabIndex={0}
      onClick={() => onCardClick(restaurant)}
      onKeyDown={(e) => e.key === 'Enter' && onCardClick(restaurant)}
      className={`qb-card rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer group transition-all duration-300 ${
        isSpotlighted ? 'border-red-500 ring-2 ring-red-200 scale-[1.02]' : 'border-gray-100'
      }`}
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full skeleton-shimmer" />
        )}

        {restaurant.isFeatured && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md">Featured</span>
        )}

        <span className="absolute top-3 right-3 bg-white text-xs px-2 py-1 rounded-md font-medium">
          ★ {restaurant.ratingScore} ({restaurant.reviewCount}+)
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xl font-extrabold leading-tight">{restaurant.restaurantName}</h4>
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`text-lg leading-none transition-transform active:scale-75 ${isFavorited ? 'text-red-600 scale-110' : 'text-gray-300'}`}
            aria-label="Favourite"
          >
            {isFavorited ? '♥' : '♡'}
          </button>
        </div>
        <p className="text-base font-semibold text-gray-600 mt-1 capitalize">{restaurant.cuisineLabel}</p>
        <p className="text-lg font-semibold text-gray-600 mt-2">{restaurant.deliveryMinutes} • <span className="text-red-600 font-extrabold">{restaurant.deliveryFee}</span></p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="text-red-600 text-lg font-extrabold"
            onClick={(e) => { e.stopPropagation(); onOpenMenu(restaurant) }}
          >
            Menu →
          </button>
        </div>
      </div>
    </article>
  )
}

export default RestaurantCard
