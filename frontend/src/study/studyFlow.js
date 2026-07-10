// Canonical dissertation participant journey — one path, no alternate routes.

/** Time to show "item added" feedback before auto-redirect to basket (Task 2 → Task 3). */
export const POST_ADD_BASKET_REDIRECT_MS = 1200

/** Header basket icon is display-only; participants reach basket only after add. */
export function isBasketNavigationEnabled() {
  return false
}

/** Post-login/register return when checkout requires an account. */
export function getPostAuthPath(basketItemCount) {
  return basketItemCount > 0 ? '/basket' : '/'
}
