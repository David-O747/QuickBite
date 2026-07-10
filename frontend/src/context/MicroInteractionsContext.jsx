import { createContext, useContext } from 'react'

/*
  MICRO-INTERACTIONS MAP (Site B only — controlled study variable)
  Toggle: VITE_SITE_VERSION=B in .env | wrapper class mi-on/mi-off in App.jsx
  All CSS lives in: frontend/src/index.css

  1. Click confirmation (150ms)     → CtaButton.jsx + .mi-cta in index.css
  2. Hover transition (200ms)         → CtaButton.jsx + .mi-cta in index.css
  3. Loading spinner                → LoadingSpinner.jsx + .mi-spinner
  4. Success message                → SuccessBanner.jsx, OrderConfirmationPage.jsx (.mi-check-icon)
  5. Item added animation           → BrowsePage, ProductPage, RestaurantMenuPage (.mi-added-label, .mi-basket-count)
  6. Checkout progress bar          → CheckoutProgress.jsx (.mi-step-dot, .mi-step-line)
  7. Active field border            → FormField.jsx, PasswordField.jsx (.mi-field:focus)
  8. Inline validation on blur      → FormField.jsx, PasswordField.jsx (.mi-valid / .mi-invalid)
  9. Password strength (register)   → PasswordField.jsx (.mi-req-tick)
  10. Basket success inline msg     → BrowsePage, ProductPage, RestaurantMenuPage (.mi-basket-msg)

  Site A: set VITE_SITE_VERSION=A — same components, mi-off disables all effects.
*/

const MicroInteractionsContext = createContext(true)

export function MicroInteractionsProvider({ enabled = true, children }) {
  return (
    <MicroInteractionsContext.Provider value={enabled}>
      {children}
    </MicroInteractionsContext.Provider>
  )
}

export function useMicroInteractions() {
  return useContext(MicroInteractionsContext)
}
