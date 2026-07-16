import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useMicroInteractions } from '../context/MicroInteractionsContext'
import {
  buildMenuForRestaurant,
  getMenuReturnPath,
  getRestaurantFromStorage,
} from '../data/restaurantMenus'
import { restaurantList } from '../data/homeContent'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CtaButton from '../components/CtaButton'
import LoadingSpinner from '../components/LoadingSpinner'
import RestaurantBasketPopup from '../components/RestaurantBasketPopup'
import { endTaskTimer, getStudyMeta } from '../tracking/trackingService'
import { POST_ADD_BASKET_REDIRECT_MS } from '../study/studyFlow'

const menuSections = [
  { sectionKey: 'popular', sectionLabel: 'Popular Items' },
  { sectionKey: 'mains', sectionLabel: 'Main Courses' },
  { sectionKey: 'sides', sectionLabel: 'Sides' },
  { sectionKey: 'beverages', sectionLabel: 'Beverages' },
  { sectionKey: 'desserts', sectionLabel: 'Desserts' },
]

function RestaurantMenuPage() {
  const { restaurantId } = useParams()
  const app = useApp()
  const navigate = useNavigate()
  const miEnabled = useMicroInteractions()

  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('popular')
  const [menuSearch, setMenuSearch] = useState('')
  const [pulseBasket, setPulseBasket] = useState(false)
  const [addedProductId, setAddedProductId] = useState(null)
  const [basketMsgProductId, setBasketMsgProductId] = useState(null)
  const [showBasketPopup, setShowBasketPopup] = useState(false)
  const [pendingMenuItem, setPendingMenuItem] = useState(null)

  const restaurant = useMemo(() => {
    const fromStorage = getRestaurantFromStorage(restaurantId)
    if (fromStorage) return fromStorage
    return restaurantList.find((r) => r.restaurantId === restaurantId) || null
  }, [restaurantId])

  const menuData = useMemo(
    () => (restaurant ? buildMenuForRestaurant(restaurant) : null),
    [restaurant]
  )

  const studyMeta = useMemo(
    () => getStudyMeta(app),
    [app.participantId, app.ageGroup, app.sessionId]
  )

  useEffect(() => {
    endTaskTimer('locate_product', studyMeta)
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(timer)
  }, [restaurantId, studyMeta])

  useEffect(() => {
    if (!restaurant) return
    if (
      app.basketItemCount > 0 &&
      app.basketRestaurantId &&
      app.basketRestaurantId !== restaurant.restaurantId
    ) {
      setShowBasketPopup(true)
    }
  }, [restaurant, app.basketItemCount, app.basketRestaurantId])

  function handleBack() {
    navigate(getMenuReturnPath())
  }

  function addButtonLabel(productId, defaultLabel, addedLabel = 'Added ✓') {
    if (miEnabled && addedProductId === productId) return addedLabel
    return defaultLabel
  }

  function showAddedFeedback(menuItem) {
    if (miEnabled) {
      setAddedProductId(menuItem.productId)
      setPulseBasket(true)
      setBasketMsgProductId(menuItem.productId)
      setTimeout(() => setPulseBasket(false), 200)
      setTimeout(() => setAddedProductId(null), 1500)
      setTimeout(() => setBasketMsgProductId(null), 2000)
    }

    setShowBasketPopup(false)
    setPendingMenuItem(null)
  }

  function handleAddToBasket(menuItem) {
    const result = app.addToBasket({
      productId: menuItem.productId,
      productName: menuItem.productName,
      productDescription: menuItem.productDescription,
      unitPrice: menuItem.unitPrice,
      categoryTag: menuItem.categoryTag,
      imagePath: menuItem.imagePath,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
    })

    if (!result.success) {
      if (result.reason === 'different_restaurant') {
        setPendingMenuItem(menuItem)
        setShowBasketPopup(true)
      }
      return
    }

    endTaskTimer('add_to_basket', getStudyMeta(app))
    showAddedFeedback(menuItem)

    window.setTimeout(() => {
      navigate('/basket')
    }, POST_ADD_BASKET_REDIRECT_MS)
  }

  function handlePopupCleared() {
    if (pendingMenuItem) {
      handleAddToBasket(pendingMenuItem)
    }
  }

  function scrollToSection(sectionKey) {
    setActiveSection(sectionKey)
    document.getElementById(`menu-${sectionKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function matchesSearch(item) {
    const query = menuSearch.trim().toLowerCase()
    if (!query) return true
    return (
      item.productName.toLowerCase().includes(query) ||
      item.productDescription.toLowerCase().includes(query)
    )
  }

  if (!restaurant || !menuData) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Restaurant not found</h1>
          <CtaButton
            ctaButtonId="menu_missing_home"
            className="mt-6 rounded-full"
            onClick={() => navigate('/')}
          >
            Back to home
          </CtaButton>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const popularItems = menuData.popularItems.filter(matchesSearch)
  const mainCourses = menuData.mainCourses.filter(matchesSearch)
  const sideItems = menuData.sideItems.filter(matchesSearch)
  const beverageItems = menuData.beverageItems.filter(matchesSearch)
  const dessertItems = menuData.dessertItems.filter(matchesSearch)
  const featuredMain = mainCourses.find((item) => item.isFeatured) || mainCourses[0]
  const listMains = mainCourses.filter((item) => item.productId !== featuredMain?.productId)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SiteHeader pulseBasket={pulseBasket} />

      <RestaurantBasketPopup
        isOpen={showBasketPopup}
        newRestaurantName={restaurant.restaurantName}
        onClose={() => {
          setShowBasketPopup(false)
          setPendingMenuItem(null)
        }}
        onClearedBasket={handlePopupCleared}
      />

      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-gray-700 font-medium"
          >
            ← Back to restaurants
          </button>
          <p className="text-xs text-gray-500 mt-1">
            <Link to="/" className="text-red-600">Home</Link>
            {' / '}
            <button type="button" onClick={handleBack} className="text-red-600">
              Restaurants
            </button>
            {' / '}
            <span>{restaurant.restaurantName}</span>
          </p>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
          <nav className="flex items-center gap-5 text-sm">
            <span className="text-red-600 border-b-2 border-red-600 pb-1 font-medium">Menu</span>
            <span className="text-gray-400">Offers</span>
          </nav>
          <div className="flex-1 md:max-w-md md:mx-auto">
            <input
              type="search"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section
            className="relative bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${restaurant.imagePath})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Free Delivery
                </span>
                <span className="bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
                  ★ {restaurant.ratingScore} ({restaurant.reviewCount}+)
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
                {restaurant.restaurantName}
              </h1>
              <p className="mt-3 max-w-xl text-gray-100">
                {menuData.restaurantDescription}
              </p>
              <p className="mt-3 text-sm text-gray-200">
                {restaurant.cuisineLabel} • {restaurant.deliveryMinutes} • {restaurant.deliveryFee}
              </p>
            </div>
          </section>

          <div className="sticky top-[73px] z-10 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-3 flex gap-5 overflow-x-auto text-sm">
              {menuSections.map((section) => (
                <button
                  key={section.sectionKey}
                  type="button"
                  onClick={() => scrollToSection(section.sectionKey)}
                  className={`whitespace-nowrap pb-1 ${
                    activeSection === section.sectionKey
                      ? 'text-red-600 border-b-2 border-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  {section.sectionLabel}
                </button>
              ))}
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 py-10 space-y-12 pb-10">
            <section id="menu-popular">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">Popular Items</h2>
                <button
                  type="button"
                  className="text-red-600 text-sm font-medium"
                  onClick={() => scrollToSection('mains')}
                >
                  View all →
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularItems.map((item) => (
                  <article
                    key={item.productId}
                    className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm h-full flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={item.imagePath}
                        alt={item.productName}
                        className="w-full h-40 object-cover"
                      />
                      {item.badgeLabel && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                          {item.badgeLabel}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
                        {item.productDescription}
                      </p>
                      <p className="text-red-600 font-bold mt-2">
                        £{item.unitPrice.toFixed(2)}
                      </p>
                      <CtaButton
                        ctaButtonId={`menu_add_${item.productId}`}
                        className="w-full mt-auto rounded-lg"
                        onClick={() => handleAddToBasket(item)}
                      >
                        {addButtonLabel(item.productId, 'Add to Basket')}
                      </CtaButton>
                      {miEnabled && (
                      <p
                        className={`mi-basket-msg mt-2 text-xs text-green-600 ${
                          basketMsgProductId === item.productId ? 'mi-visible' : ''
                        }`}
                      >
                        Item added to your basket
                      </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="menu-mains">
              <h2 className="text-2xl font-bold mb-5">Main Courses</h2>
              <div className="grid lg:grid-cols-3 gap-4">
                {featuredMain && (
                  <article className="lg:col-span-2 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                    <div className="grid md:grid-cols-2">
                      <div className="relative min-h-48">
                        <img
                          src={featuredMain.imagePath}
                          alt={featuredMain.productName}
                          className="w-full h-full object-cover min-h-48"
                        />
                        {featuredMain.badgeLabel && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {featuredMain.badgeLabel}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col justify-center">
                        <h3 className="text-xl font-bold">{featuredMain.productName}</h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {featuredMain.productDescription}
                        </p>
                        <p className="text-red-600 font-bold text-lg mt-3">
                          £{featuredMain.unitPrice.toFixed(2)}
                        </p>
                        <CtaButton
                          ctaButtonId={`menu_add_${featuredMain.productId}`}
                          className="mt-4 rounded-lg w-fit"
                          onClick={() => handleAddToBasket(featuredMain)}
                        >
                          {addButtonLabel(featuredMain.productId, 'Add to Basket')}
                        </CtaButton>
                        {miEnabled && (
                        <p
                          className={`mi-basket-msg mt-2 text-xs text-green-600 ${
                            basketMsgProductId === featuredMain.productId ? 'mi-visible' : ''
                          }`}
                        >
                          Item added to your basket
                        </p>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                <div className="space-y-3">
                  {listMains.map((item) => (
                    <article
                      key={item.productId}
                      className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{item.productName}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.productDescription}
                          </p>
                          <p className="text-red-600 font-bold mt-2">
                            £{item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <CtaButton
                          ctaButtonId={`menu_add_${item.productId}`}
                          className="!px-3 !py-2 !rounded-full shrink-0"
                          onClick={() => handleAddToBasket(item)}
                        >
                          {addButtonLabel(item.productId, '+', '✓')}
                        </CtaButton>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="menu-sides">
              <h2 className="text-2xl font-bold mb-5">Sides</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {sideItems.map((item) => (
                  <article key={item.productId} className="text-center">
                    <img
                      src={item.imagePath}
                      alt={item.productName}
                      className="w-24 h-24 mx-auto rounded-full object-cover border border-gray-100"
                    />
                    <h3 className="mt-2 font-medium text-sm">{item.productName}</h3>
                    <p className="text-red-600 font-bold text-sm mt-1">
                      £{item.unitPrice.toFixed(2)}
                    </p>
                    <CtaButton
                      ctaButtonId={`menu_add_${item.productId}`}
                      className="mt-2 !bg-gray-100 !text-gray-800 !px-4 !py-1.5 rounded-full text-xs"
                      onClick={() => handleAddToBasket(item)}
                    >
                      {addButtonLabel(item.productId, 'ADD')}
                    </CtaButton>
                  </article>
                ))}
              </div>
            </section>

            <section id="menu-beverages">
              <h2 className="text-2xl font-bold mb-5">Beverages</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {beverageItems.map((item) => (
                  <article
                    key={item.productId}
                    className="rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-red-600 font-bold mt-1">
                        £{item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <CtaButton
                      ctaButtonId={`menu_add_${item.productId}`}
                      className="!px-3 !py-2 !rounded-full"
                      onClick={() => handleAddToBasket(item)}
                    >
                      {addButtonLabel(item.productId, '+', '✓')}
                    </CtaButton>
                  </article>
                ))}
              </div>
            </section>

            <section id="menu-desserts">
              <h2 className="text-2xl font-bold mb-5">Desserts</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {dessertItems.map((item) => (
                  <article
                    key={item.productId}
                    className="rounded-xl border border-gray-100 overflow-hidden grid grid-cols-[120px_1fr]"
                  >
                    <img
                      src={item.imagePath}
                      alt={item.productName}
                      className="w-full h-full object-cover min-h-28"
                    />
                    <div className="p-4">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-red-600 font-bold mt-1">
                        £{item.unitPrice.toFixed(2)}
                      </p>
                      <CtaButton
                        ctaButtonId={`menu_add_${item.productId}`}
                        className="mt-3 rounded-lg"
                        onClick={() => handleAddToBasket(item)}
                      >
                        {addButtonLabel(item.productId, 'Add to Basket')}
                      </CtaButton>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </>
      )}

      <SiteFooter />
    </div>
  )
}

export default RestaurantMenuPage
