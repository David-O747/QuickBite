import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

const AUTH_KEY = 'qb_customer'
const SESSION_KEY = 'qb_session_id'
const ADDRESS_KEY = 'qb_delivery_address'

function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export function AppProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [deliveryAddress, setDeliveryAddressState] = useState(
    () => localStorage.getItem(ADDRESS_KEY) || ''
  )
  const [basketItems, setBasketItems] = useState([])
  const [basketRestaurantId, setBasketRestaurantId] = useState(null)
  const [basketRestaurantName, setBasketRestaurantName] = useState('')
  const [lastOrder, setLastOrder] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  function setDeliveryAddress(address) {
    setDeliveryAddressState(address)
    localStorage.setItem(ADDRESS_KEY, address)
  }

  const studyParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      participantId: params.get('participant_id') || 'anonymous',
      ageGroup: params.get('age_group') || 'unknown',
    }
  }, [])

  function registerCustomer(customerData) {
    const savedCustomer = {
      customerEmail: customerData.customerEmail,
      customerUsername: customerData.customerUsername,
    }
    setCustomer(savedCustomer)
    localStorage.setItem(AUTH_KEY, JSON.stringify(savedCustomer))
  }

  function loginCustomer(customerData) {
    const savedCustomer = {
      customerEmail: customerData.customerEmail,
      customerUsername: customerData.customerUsername || customerData.customerEmail.split('@')[0],
    }
    setCustomer(savedCustomer)
    localStorage.setItem(AUTH_KEY, JSON.stringify(savedCustomer))
  }

  function logoutCustomer() {
    setCustomer(null)
    localStorage.removeItem(AUTH_KEY)
  }

  function addToBasket(product) {
    const { restaurantId, restaurantName } = product

    if (!restaurantId || !restaurantName) {
      return {
        success: false,
        reason: 'missing_restaurant',
      }
    }

    if (
      basketItems.length > 0 &&
      basketRestaurantId &&
      basketRestaurantId !== restaurantId
    ) {
      return {
        success: false,
        reason: 'different_restaurant',
        currentRestaurantName: basketRestaurantName,
      }
    }

    if (basketItems.length === 0) {
      setBasketRestaurantId(restaurantId)
      setBasketRestaurantName(restaurantName)
    }

    setBasketItems((items) => {
      const existing = items.find((i) => i.productId === product.productId)
      if (existing) {
        return items.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...items, { ...product, quantity: 1 }]
    })

    return { success: true }
  }

  function updateBasketQuantity(productId, changeAmount) {
    setBasketItems((items) => {
      const nextItems = items
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + changeAmount }
            : i
        )
        .filter((i) => i.quantity > 0)

      if (nextItems.length === 0) {
        setBasketRestaurantId(null)
        setBasketRestaurantName('')
      }

      return nextItems
    })
  }

  function removeFromBasket(productId) {
    setBasketItems((items) => {
      const nextItems = items.filter((i) => i.productId !== productId)
      if (nextItems.length === 0) {
        setBasketRestaurantId(null)
        setBasketRestaurantName('')
      }
      return nextItems
    })
  }

  function clearBasket() {
    setBasketItems([])
    setBasketRestaurantId(null)
    setBasketRestaurantName('')
  }

  function placeOrder(orderDetails) {
    const orderNumber = `QB-${Date.now().toString().slice(-8)}`
    const prepMs = 15000 + Math.floor(Math.random() * 10000)
    const onTheWayMs = prepMs + 15000 + Math.floor(Math.random() * 12000)
    const deliveredMs = onTheWayMs + 15000 + Math.floor(Math.random() * 12000)
    const etaMin = 8 + Math.floor(Math.random() * 5)
    const orderRecord = {
      orderNumber,
      orderItems: [...basketItems],
      restaurantName: basketRestaurantName,
      orderSubtotal: orderDetails.orderSubtotal ?? basketTotal,
      deliveryFee: orderDetails.deliveryFee ?? 0,
      serviceFee: orderDetails.serviceFee ?? 0,
      promoDiscount: orderDetails.promoDiscount ?? 0,
      promoCode: orderDetails.promoCode ?? '',
      orderTotal: orderDetails.orderTotal ?? basketTotal,
      estimatedArrival: orderDetails.estimatedArrival || `${etaMin}-${etaMin + 4} minutes`,
      backendOrderId: orderDetails.backendOrderId || '',
      trackingPublicId: orderDetails.trackingPublicId || '',
      supportPhone: orderDetails.supportPhone || '',
      backendStatus: orderDetails.backendStatus || 'confirmed',
      statusTimelineMs: {
        preparingAt: prepMs,
        onTheWayAt: onTheWayMs,
        deliveredAt: deliveredMs,
      },
      deliveryDetails: orderDetails.deliveryDetails,
      paymentDetails: orderDetails.paymentDetails,
      contactEmail: orderDetails.contactEmail || customer?.customerEmail || '',
      contactPhone: orderDetails.contactPhone || orderDetails.deliveryDetails?.phoneNumber || '',
      placedAt: new Date().toISOString(),
    }
    setLastOrder(orderRecord)
    clearBasket()
    return orderRecord
  }

  const basketTotal = useMemo(
    () => basketItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [basketItems]
  )

  const basketItemCount = basketItems.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    customer,
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    isLoggedIn: Boolean(customer),
    deliveryAddress,
    setDeliveryAddress,
    basketItems,
    basketTotal,
    basketItemCount,
    basketRestaurantId,
    basketRestaurantName,
    addToBasket,
    updateBasketQuantity,
    removeFromBasket,
    clearBasket,
    placeOrder,
    lastOrder,
    isPageLoading,
    setIsPageLoading,
    sessionId,
    participantId: studyParams.participantId,
    ageGroup: studyParams.ageGroup,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
