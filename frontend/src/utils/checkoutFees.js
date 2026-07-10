export const DELIVERY_FEE = 2.99
export const SERVICE_FEE = 1.5

export function getStoredPromoCode() {
  return sessionStorage.getItem('qb_promo') || ''
}

export function calculatePromoDiscount(subtotal, promoCode) {
  if (promoCode === 'WELCOME10' && subtotal >= 30) return 10
  return 0
}

export function calculateOrderTotal(subtotal, promoCode = getStoredPromoCode()) {
  const promoDiscount = calculatePromoDiscount(subtotal, promoCode)
  return subtotal + DELIVERY_FEE + SERVICE_FEE - promoDiscount
}
