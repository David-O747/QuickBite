import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchCustomerOrders,
  fetchCustomerProfile,
  updateCustomerProfile,
} from '../api/profileApi'

const AppContext = createContext(null)

const AUTH_KEY = 'qb_customer'
const SESSION_KEY = 'qb_session_id'
const LEGACY_ADDRESS_KEY = 'qb_delivery_address'
const ORDER_HISTORY_KEY = 'qb_order_history'

function addressKeyForCustomer(customerId) {
  return customerId ? `qb_delivery_address_${customerId}` : null
}

function loadDeliveryAddressForCustomer(customer) {
  if (!customer?.id) return ''
  return localStorage.getItem(addressKeyForCustomer(customer.id)) || ''
}

function deliveryDetailsKeyForCustomer(customerId) {
  return customerId ? `qb_delivery_details_${customerId}` : null
}

function loadDeliveryDetailsForCustomer(customer) {
  if (!customer?.id) return null
  try {
    return JSON.parse(localStorage.getItem(deliveryDetailsKeyForCustomer(customer.id)) || 'null')
  } catch {
    return null
  }
}

function loadOrderHistory() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

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
  const [deliveryAddress, setDeliveryAddressState] = useState(() =>
    loadDeliveryAddressForCustomer(
      (() => {
        try {
          return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
        } catch {
          return null
        }
      })()
    )
  )
  const [basketItems, setBasketItems] = useState([])
  const [basketRestaurantId, setBasketRestaurantId] = useState(null)
  const [basketRestaurantName, setBasketRestaurantName] = useState('')
  const [lastOrder, setLastOrder] = useState(null)
  const [orderHistory, setOrderHistory] = useState([])
  const [savedDeliveryDetails, setSavedDeliveryDetails] = useState(null)
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState([])
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    preferences: true,
    study: true,
  })
  const [isPageLoading, setIsPageLoading] = useState(false)
  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  useEffect(() => {
    localStorage.removeItem(LEGACY_ADDRESS_KEY)
    sessionStorage.removeItem('qb_delivery')
  }, [])

  function applyProfile(profile) {
    if (!profile) return
    if (profile.savedPostcode) {
      setDeliveryAddressState(profile.savedPostcode)
    }
    setSavedDeliveryDetails(profile.deliveryDetails || null)
    setFavoriteRestaurantIds(profile.favoriteRestaurantIds || [])
    setCookiePreferences(
      profile.cookiePreferences || { essential: true, preferences: true, study: true }
    )
  }

  const loadCustomerData = useCallback(async (customerId) => {
    if (!customerId) return

    try {
      const { profile } = await fetchCustomerProfile(customerId)
      applyProfile(profile)
    } catch {
      const legacyAddress = loadDeliveryAddressForCustomer({ id: customerId })
      const legacyDetails = loadDeliveryDetailsForCustomer({ id: customerId })
      if (legacyAddress) setDeliveryAddressState(legacyAddress)
      if (legacyDetails) setSavedDeliveryDetails(legacyDetails)
    }

    try {
      const { orders } = await fetchCustomerOrders(customerId)
      if (orders?.length) {
        setOrderHistory(orders)
      }
    } catch {
      const legacyOrders = loadOrderHistory()
      if (legacyOrders.length) setOrderHistory(legacyOrders)
    }
  }, [])

  useEffect(() => {
    if (customer?.id) {
      loadCustomerData(customer.id)
    }
  }, [customer?.id, loadCustomerData])

  function syncProfilePatch(patch) {
    if (!customer?.id) return
    updateCustomerProfile(customer.id, patch).catch(() => {})
  }

  function saveDeliveryDetails(details) {
    setSavedDeliveryDetails(details)
    const storageKey = deliveryDetailsKeyForCustomer(customer?.id)
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(details))
    }
    syncProfilePatch({ deliveryDetails: details })
  }

  function getSavedDeliveryDetails() {
    if (savedDeliveryDetails) return savedDeliveryDetails
    return loadDeliveryDetailsForCustomer(customer)
  }

  function setDeliveryAddress(address) {
    setDeliveryAddressState(address)
    const storageKey = addressKeyForCustomer(customer?.id)
    if (storageKey) {
      if (address) {
        localStorage.setItem(storageKey, address)
      } else {
        localStorage.removeItem(storageKey)
      }
    }
    syncProfilePatch({ savedPostcode: address })
  }

  function toggleFavoriteRestaurant(restaurantId) {
    setFavoriteRestaurantIds((current) => {
      const next = current.includes(restaurantId)
        ? current.filter((id) => id !== restaurantId)
        : [...current, restaurantId]
      syncProfilePatch({ favoriteRestaurantIds: next })
      return next
    })
  }

  function saveCookiePreferences(preferences) {
    setCookiePreferences(preferences)
    if (customer?.id) {
      updateCustomerProfile(customer.id, { cookiePreferences: preferences }).catch(() => {})
      return
    }
    localStorage.setItem('qb_cookie_preferences', JSON.stringify(preferences))
  }

  const studyParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      participantId: params.get('participant_id') || 'anonymous',
      ageGroup: params.get('age_group') || 'unknown',
    }
  }, [])

  function persistCustomer(savedCustomer) {
    setCustomer(savedCustomer)
    localStorage.setItem(AUTH_KEY, JSON.stringify(savedCustomer))
  }

  function registerCustomer(customerData) {
    const savedCustomer = {
      id: customerData.id,
      customerEmail: customerData.customerEmail,
      customerUsername: customerData.customerUsername,
    }
    persistCustomer(savedCustomer)
    setDeliveryAddressState(loadDeliveryAddressForCustomer(savedCustomer))
  }

  function loginCustomer(customerData) {
    const savedCustomer = {
      id: customerData.id,
      customerEmail: customerData.customerEmail,
      customerUsername: customerData.customerUsername,
    }
    persistCustomer(savedCustomer)
    setDeliveryAddressState(loadDeliveryAddressForCustomer(savedCustomer))
  }

  function logoutCustomer() {
    setCustomer(null)
    setDeliveryAddressState('')
    setSavedDeliveryDetails(null)
    setFavoriteRestaurantIds([])
    setOrderHistory([])
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

  function saveOrderToHistory(orderRecord) {
    setOrderHistory((prev) => {
      return [orderRecord, ...prev.filter((o) => o.orderNumber !== orderRecord.orderNumber)].slice(
        0,
        20
      )
    })
  }

  function updateOrderInHistory(orderNumber, updates) {
    setOrderHistory((prev) => {
      return prev.map((order) =>
        order.orderNumber === orderNumber ? { ...order, ...updates } : order
      )
    })
    setLastOrder((current) =>
      current?.orderNumber === orderNumber ? { ...current, ...updates } : current
    )
  }

  function openOrder(orderNumber) {
    const order = orderHistory.find((entry) => entry.orderNumber === orderNumber)
    if (order) setLastOrder(order)
    return order
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
    saveOrderToHistory(orderRecord)
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
    getSavedDeliveryDetails,
    saveDeliveryDetails,
    favoriteRestaurantIds,
    toggleFavoriteRestaurant,
    cookiePreferences,
    saveCookiePreferences,
    loadCustomerData,
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
    orderHistory,
    openOrder,
    updateOrderInHistory,
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
