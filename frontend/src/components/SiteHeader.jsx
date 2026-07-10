import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { restaurantList } from '../data/homeContent'
import { productList } from '../data/products'
import { saveRestaurantToStorage, saveMenuReturnPath } from '../data/restaurantMenus'
import { hasBasketFromOtherRestaurant } from '../utils/basketRestaurantGuard'
import RestaurantBasketPopup from './RestaurantBasketPopup'
import CtaButton from './CtaButton'
import { isBasketNavigationEnabled } from '../study/studyFlow'

function LocationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function BasketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" fill="#dc2626" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="#dc2626" stroke="none" />
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  )
}

function SiteHeader({ pulseBasket = false, pageVariant = 'default' }) {
  const app = useApp()
  const { basketItemCount, isLoggedIn, logoutCustomer, customer, deliveryAddress, setDeliveryAddress } = app
  const navigate = useNavigate()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [addressDraft, setAddressDraft] = useState(deliveryAddress || '')
  const [pendingRestaurant, setPendingRestaurant] = useState(null)
  const [showBasketPopup, setShowBasketPopup] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const navClass = (path) =>
    location.pathname === path
      ? 'text-red-600 border-b-2 border-red-600 pb-1 font-medium'
      : 'text-gray-800'

  const query = searchQuery.trim().toLowerCase()
  const restaurantHits = query
    ? restaurantList
        .filter(
          (r) =>
            r.restaurantName.toLowerCase().includes(query) ||
            r.categoryTag.toLowerCase().includes(query)
        )
        .slice(0, 5)
    : []
  const dishHits = query
    ? productList
        .filter(
          (p) =>
            p.productName.toLowerCase().includes(query) ||
            p.categoryTag.toLowerCase().includes(query)
        )
        .slice(0, 5)
    : []

  function pickRestaurant(restaurant) {
    setSearchOpen(false)
    setSearchQuery('')

    if (hasBasketFromOtherRestaurant(app, restaurant.restaurantId)) {
      setPendingRestaurant(restaurant)
      setShowBasketPopup(true)
      return
    }

    saveMenuReturnPath(`${location.pathname}${location.search}`)
    saveRestaurantToStorage(restaurant)
    navigate(`/restaurant/${encodeURIComponent(restaurant.restaurantId)}`)
  }

  function continueToPendingRestaurant() {
    if (!pendingRestaurant) return
    saveMenuReturnPath(`${location.pathname}${location.search}`)
    saveRestaurantToStorage(pendingRestaurant)
    navigate(`/restaurant/${encodeURIComponent(pendingRestaurant.restaurantId)}`)
    setPendingRestaurant(null)
  }

  function pickDish(product) {
    setSearchOpen(false)
    setSearchQuery('')
    navigate('/')
  }

  function saveAddress() {
    if (!addressDraft.trim()) return
    const addressText = addressDraft.trim()
    setDeliveryAddress(addressText)
    setLocationOpen(false)
    navigate(`/?near=${encodeURIComponent(addressText)}`)
  }

  function openAccountOverview() {
    if (!isLoggedIn) {
      navigate('/login')
      setAccountOpen(false)
      return
    }
    setAccountOpen(false)
  }

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-20">
      <RestaurantBasketPopup
        isOpen={showBasketPopup}
        newRestaurantName={pendingRestaurant?.restaurantName || ''}
        onClose={() => {
          setShowBasketPopup(false)
          setPendingRestaurant(null)
        }}
        onClearedBasket={continueToPendingRestaurant}
      />
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-red-600 shrink-0">
          QuickBite
        </Link>

        <nav className={`${pageVariant === 'basket' || pageVariant === 'checkout' || pageVariant === 'confirm' ? 'flex' : 'hidden md:flex'} items-center gap-6 text-sm shrink-0`}>
          {pageVariant === 'basket' ? (
            <>
              <Link to="/" className={navClass('/')}>Browse</Link>
              <Link to="/basket" className={navClass('/basket')}>Orders</Link>
            </>
          ) : pageVariant === 'checkout' || pageVariant === 'confirm' ? (
            <>
              <Link to="/" className={navClass('/')}>Categories</Link>
              <Link to="/offers" className={navClass('/offers')}>Deals</Link>
              <Link to="/info/help-centre" className={navClass('/info/help-centre')}>Help</Link>
            </>
          ) : (
            <>
              <Link to="/" className={navClass('/')}>Home</Link>
              <Link to="/offers" className={navClass('/offers')}>Offers</Link>
              <Link to="/rewards" className={navClass('/rewards')}>Rewards</Link>
            </>
          )}
        </nav>

        {pageVariant !== 'basket' && pageVariant !== 'checkout' && pageVariant !== 'confirm' && (
        <div className="flex-1 max-w-md mx-auto relative" ref={searchRef}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search for food or restaurants"
            className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-red-500"
          />

          {searchOpen && query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-40 max-h-80 overflow-y-auto">
              {restaurantHits.length === 0 && dishHits.length === 0 && (
                <p className="p-4 text-sm text-gray-500">No results for &apos;{searchQuery}&apos;</p>
              )}

              {restaurantHits.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">Restaurants</p>
                  {restaurantHits.map((restaurant) => (
                    <button
                      key={restaurant.restaurantId}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickRestaurant(restaurant)}
                    >
                      {restaurant.restaurantName}
                    </button>
                  ))}
                </div>
              )}

              {dishHits.length > 0 && (
                <div className={`p-2 ${restaurantHits.length ? 'border-t' : ''}`}>
                  <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">Dishes</p>
                  {dishHits.map((product) => (
                    <button
                      key={product.productId}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg text-sm"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickDish(product)}
                    >
                      {product.productName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        )}

        <div className={`flex items-center gap-3 relative shrink-0 ${pageVariant === 'basket' ? 'ml-auto' : 'ml-auto'}`}>
          <button
            type="button"
            className="p-1"
            onClick={() => {
              setLocationOpen(!locationOpen)
              setAccountOpen(false)
            }}
            aria-label="Delivery location"
          >
            <LocationIcon />
          </button>

          {locationOpen && (
            <div className="absolute right-0 top-11 w-72 bg-white border border-gray-100 rounded-xl shadow-lg p-4 z-30">
              <p className="text-sm font-medium mb-2">Delivery location</p>
              <input
                type="text"
                value={addressDraft}
                onChange={(e) => setAddressDraft(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
              {deliveryAddress && (
                <p className="text-xs text-gray-500 mt-2">Current: {deliveryAddress}</p>
              )}
              <CtaButton ctaButtonId="header_save_location" className="w-full mt-3 rounded-lg" onClick={saveAddress}>
                Save location
              </CtaButton>
            </div>
          )}

          <button
            type="button"
            className={`p-1 relative ${location.pathname === '/basket' ? 'ring-2 ring-red-600 rounded-full' : ''}`}
            onClick={() => {
              if (isBasketNavigationEnabled()) navigate('/basket')
            }}
            aria-label="Basket"
            data-no-misclick={!isBasketNavigationEnabled() ? true : undefined}
          >
            <BasketIcon />
            {basketItemCount > 0 && (
              <span
                className={`mi-basket-count absolute -top-1 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ${
                  pulseBasket ? 'mi-pulse' : ''
                }`}
              >
                {basketItemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="p-1"
            onClick={() => {
              setAccountOpen(!accountOpen)
              setLocationOpen(false)
            }}
            aria-label="Account"
          >
            <ProfileIcon />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-30">
              {isLoggedIn ? (
                <>
                  <p className="px-4 py-2 text-xs text-gray-500">{customer?.customerUsername}</p>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm"
                    onClick={openAccountOverview}
                  >
                    My account
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm"
                    onClick={() => {
                      logoutCustomer()
                      setAccountOpen(false)
                      navigate('/login')
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm"
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm"
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
