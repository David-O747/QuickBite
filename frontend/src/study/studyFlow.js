export const POST_ADD_BASKET_REDIRECT_MS = 1200

export function isBasketNavigationEnabled() {
  return true
}

export function getPostAuthPath(basketItemCount) {
  return basketItemCount > 0 ? '/basket' : '/'
}
