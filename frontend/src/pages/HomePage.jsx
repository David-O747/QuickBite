import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { foodCategories, localPhotos, restaurantList as defaultRestaurants } from '../data/homeContent'
import { geocodeAddress } from '../api/geocodeAddress'
import { fetchOsmRestaurantsNear } from '../api/fetchOsmRestaurants'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import LoadingSpinner from '../components/LoadingSpinner'
import { saveRestaurantToStorage, saveMenuReturnPath } from '../data/restaurantMenus'
import { hasBasketFromOtherRestaurant } from '../utils/basketRestaurantGuard'
import RestaurantBasketPopup from '../components/RestaurantBasketPopup'
import { startTaskTimer } from '../tracking/trackingService'

function LocationPinSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function HomePage() {
  const app = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const restaurantSectionRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSearchingNearby, setIsSearchingNearby] = useState(false)
  const [heroAddress, setHeroAddress] = useState(
    () => (app.isLoggedIn ? app.deliveryAddress : '') || ''
  )
  const [searchStatus, setSearchStatus] = useState('')
  const [nearbyRestaurants, setNearbyRestaurants] = useState(defaultRestaurants)
  const [activeCategory, setActiveCategory] = useState(null)
  const favoriteIds = useMemo(
    () => new Set(app.favoriteRestaurantIds),
    [app.favoriteRestaurantIds]
  )
  const [pendingRestaurant, setPendingRestaurant] = useState(null)
  const [showBasketPopup, setShowBasketPopup] = useState(false)
  const [heroVideoFailed, setHeroVideoFailed] = useState(false)

  useEffect(() => {
    startTaskTimer('locate_product')
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!app.isLoggedIn) {
      setHeroAddress('')
      return
    }
    if (app.deliveryAddress) {
      setHeroAddress(app.deliveryAddress)
    }
  }, [app.isLoggedIn, app.deliveryAddress])

  const searchNearbyRestaurants = useCallback(async (addressText) => {
    const query = addressText.trim()
    if (!query) {
      setSearchStatus('Enter an address or postcode first.')
      return
    }

    setIsSearchingNearby(true)
    setSearchStatus('Finding your location...')
    setActiveCategory(null)
    restaurantSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const location = await geocodeAddress(query)

    if (!location) {
      setIsSearchingNearby(false)
      setSearchStatus('Could not find that address or postcode. Try again (e.g. SW1A 1AA).')
      return
    }

    app.setDeliveryAddress(query)
    setSearchStatus(`Searching restaurants near ${location.displayName.split(',').slice(0, 2).join(',')}...`)

    const places = await fetchOsmRestaurantsNear(
      location.latitude,
      location.longitude,
      90,
      8000
    )

    setIsSearchingNearby(false)

    if (places.length === 0) {
      setNearbyRestaurants(defaultRestaurants)
      setSearchStatus(`No restaurants found near "${query}". Showing popular places instead.`)
      return
    }

    setNearbyRestaurants(places)
    setSearchStatus(`Showing ${places.length} restaurants near ${query}`)
  }, [app])

  useEffect(() => {
    const nearQuery = searchParams.get('near')
    if (nearQuery) {
      setHeroAddress(nearQuery)
      searchNearbyRestaurants(nearQuery)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams, searchNearbyRestaurants])

  const filteredRestaurants = activeCategory
    ? nearbyRestaurants.filter((r) => r.categoryTag === activeCategory)
    : nearbyRestaurants

  function scrollToRestaurants() {
    setTimeout(() => {
      restaurantSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function handleFindRestaurants() {
    searchNearbyRestaurants(heroAddress)
  }

  function handleAddressKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      searchNearbyRestaurants(heroAddress)
    }
  }

  function handleCategoryPick(categoryName) {
    setActiveCategory((current) => (current === categoryName ? null : categoryName))
    scrollToRestaurants()
  }

  function openRestaurantMenu(restaurant) {
    if (hasBasketFromOtherRestaurant(app, restaurant.restaurantId)) {
      setPendingRestaurant(restaurant)
      setShowBasketPopup(true)
      return
    }

    saveMenuReturnPath('/')
    saveRestaurantToStorage(restaurant)
    navigate(`/restaurant/${encodeURIComponent(restaurant.restaurantId)}`)
  }

  function continueToPendingRestaurant() {
    if (!pendingRestaurant) return
    saveMenuReturnPath('/')
    saveRestaurantToStorage(pendingRestaurant)
    navigate(`/restaurant/${encodeURIComponent(pendingRestaurant.restaurantId)}`)
    setPendingRestaurant(null)
  }

  function toggleFavorite(restaurantId) {
    app.toggleFavoriteRestaurant(restaurantId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteHeader />

      <RestaurantBasketPopup
        isOpen={showBasketPopup}
        newRestaurantName={pendingRestaurant?.restaurantName || ''}
        onClose={() => {
          setShowBasketPopup(false)
          setPendingRestaurant(null)
        }}
        onClearedBasket={continueToPendingRestaurant}
      />

      <section className="relative overflow-hidden text-white min-h-[420px] md:min-h-[520px]">
        {!heroVideoFailed ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={localPhotos.heroPoster}
            onError={() => setHeroVideoFailed(true)}
          >
            <source src={localPhotos.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${localPhotos.heroBackground})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-bold max-w-xl leading-tight">
            Craving something <span className="text-orange-400">delicious?</span>
          </h1>
          <p className="mt-4 max-w-lg text-gray-100">
            Order from local restaurants and get fresh meals delivered to your door.
          </p>

          <div className="mt-8 bg-white rounded-full p-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <LocationPinSmall />
              <input
                type="text"
                value={heroAddress}
                onChange={(e) => setHeroAddress(e.target.value)}
                onKeyDown={handleAddressKeyDown}
                placeholder="Enter delivery address or postcode"
                className="flex-1 text-gray-700 text-sm focus:outline-none"
              />
            </div>
            <CtaButton
              ctaButtonId="hero_find_restaurants"
              className="rounded-full px-6 py-3"
              onClick={handleFindRestaurants}
              disabled={isSearchingNearby}
            >
              {isSearchingNearby ? 'Searching...' : 'Find restaurants →'}
            </CtaButton>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-2">
        <section className="home-dot-band rounded-3xl px-4 py-8 sm:px-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-red-100/60" />
          <div className="absolute left-6 bottom-4 home-fade-watermark hidden sm:block">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
              <path d="M12 2C8 2 5 5 5 9c0 5 4 9 7 13 3-4 7-8 7-13 0-4-3-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
          </div>

          <div className="relative flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <p className="home-section-eyebrow">What are you craving?</p>
              <h2 className="home-title text-2xl sm:text-3xl mt-1">Browse Categories</h2>
              <p className="text-sm text-gray-500 mt-1.5 max-w-md">
                Tap a cuisine to filter restaurants below
              </p>
            </div>
            <button
              type="button"
              className="text-red-600 text-sm font-semibold shrink-0"
              onClick={scrollToRestaurants}
            >
              View restaurants →
            </button>
          </div>

          <div className="relative grid grid-cols-4 sm:grid-cols-7 gap-4 sm:gap-5">
            {foodCategories.map((category) => {
              const isActive = activeCategory === category.categoryName
              return (
                <button
                  key={category.categoryName}
                  type="button"
                  onClick={() => handleCategoryPick(category.categoryName)}
                  className="text-center"
                >
                  <div
                    className={`relative w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 mx-auto rounded-full p-0.5 ${
                      isActive
                        ? 'bg-gradient-to-br from-red-500 to-orange-400'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-white">
                      <img
                        src={category.imagePath}
                        alt={category.categoryName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p
                    className={`mt-2 text-xs sm:text-sm font-semibold ${
                      isActive ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {category.categoryName}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section
          id="restaurant-list"
          ref={restaurantSectionRef}
          className="home-restaurant-band rounded-3xl px-4 py-8 sm:px-8 mt-6 relative overflow-hidden"
        >
          <div className="absolute right-4 top-6 home-fade-watermark hidden lg:block">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-900">
              <path d="M4 11h16M6 11V7a2 2 0 0 1 2-2h1l2 3h2l2-3h1a2 2 0 0 1 2 2v4" />
              <path d="M7 18h10" />
            </svg>
          </div>

          <div className="relative flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="home-section-eyebrow">Near you</p>
              <h2 className="home-title text-2xl sm:text-3xl mt-1">Top Rated Restaurants</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm">
                  {filteredRestaurants.length} places
                </span>
                {activeCategory && (
                  <span className="text-xs font-semibold bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full">
                    {activeCategory}
                  </span>
                )}
              </div>
              {searchStatus && (
                <p className="text-sm text-gray-500 mt-2 max-w-lg">{searchStatus}</p>
              )}
            </div>
            <button
              type="button"
              className="text-sm font-medium text-gray-500 border border-gray-200 bg-white px-4 py-2 rounded-full shadow-sm"
              onClick={() => {
                setActiveCategory(null)
                setNearbyRestaurants(defaultRestaurants)
                setSearchStatus('')
              }}
            >
              Reset filters
            </button>
          </div>

          {isSearchingNearby ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <article
                    key={restaurant.restaurantId}
                    className="home-card-surface rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => openRestaurantMenu(restaurant)}
                    >
                      <div className="relative h-32 sm:h-36 bg-gray-100">
                        <img
                          src={restaurant.imagePath}
                          alt={restaurant.restaurantName}
                          className="w-full h-full object-cover"
                        />
                        {restaurant.isFeatured && (
                          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                            Featured
                          </span>
                        )}
                        <span className="absolute top-2.5 right-2.5 bg-white/95 text-xs px-2 py-1 rounded-lg font-bold shadow-sm">
                          ★ {restaurant.ratingScore}
                        </span>
                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-black/55 text-white px-2 py-0.5 rounded-md backdrop-blur-[2px]">
                          {restaurant.categoryTag}
                        </span>
                      </div>
                    </button>

                    <div className="p-4 border-t border-gray-100">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-extrabold text-2xl leading-tight line-clamp-2 text-gray-900">
                          {restaurant.restaurantName}
                        </h3>
                        <button
                          type="button"
                          className="text-base leading-none text-red-500 shrink-0"
                          onClick={() => toggleFavorite(restaurant.restaurantId)}
                          aria-label="Favourite"
                        >
                          {favoriteIds.has(restaurant.restaurantId) ? '♥' : '♡'}
                        </button>
                      </div>
                      <p className="text-base font-semibold text-gray-600 mt-1.5 line-clamp-1">
                        {restaurant.cuisineLabel}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <p className="text-2xl font-semibold text-gray-600">
                          {restaurant.deliveryMinutes}
                        </p>
                        <span className="text-lg font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          {restaurant.deliveryFee}
                        </span>
                      </div>
                      <div className="mt-3.5 pt-2.5 border-t border-dashed border-gray-200 flex justify-end">
                        <button
                          type="button"
                          className="text-red-600 text-xl font-extrabold tracking-tight"
                          onClick={() => openRestaurantMenu(restaurant)}
                        >
                          Menu →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredRestaurants.length === 0 && (
                <p className="text-center text-gray-500 py-10">No restaurants match this filter.</p>
              )}
            </>
          )}
        </section>

        <section className="bg-red-600 rounded-2xl overflow-hidden grid md:grid-cols-2 items-center mt-10">
          <div className="p-8 md:p-10 text-white">
            <h2 className="text-3xl font-bold">First order is on us!</h2>
            <p className="mt-3 text-red-100">
              Free delivery and £10 off your first order over £30. Use code WELCOME10.
            </p>
            <CtaButton
              ctaButtonId="promo_get_started"
              className="mt-6 !bg-white !text-red-600 rounded-full px-6 py-3"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </CtaButton>
          </div>
          <div className="h-56 md:h-full min-h-[220px]">
            <img
              src={localPhotos.pizzaPhoto}
              alt="Promo meal"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default HomePage
