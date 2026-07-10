/*
  Study popup catalog — excluded from the micro-interactions IV.
  Identical on Site A and Site B. Personalization is factual only.
*/

export const POPUP_STORAGE_KEYS = {
  cookieNotice: 'qb_popup_cookie_seen',
  securePaymentInfo: 'qb_popup_secure_payment_seen',
}

export const popupCatalog = {
  cookie_essential: {
    popupId: 'cookie_essential',
    triggerType: 'auto_once_device',
    blocksTask: false,
    iconId: 'lucide:cookie',
    showAvatar: false,
    titleText: 'Cookies on QuickBite',
    bodyText:
      'We use essential cookies to keep you signed in, remember your delivery location, and run the site. Optional study cookies may log anonymous task metrics for academic research. No advertising cookies are used.',
    primaryLabel: 'Accept & continue',
    primaryCtaId: 'popup_cookie_accept',
  },

  delivery_saved: {
    popupId: 'delivery_saved',
    triggerType: 'user_action',
    blocksTask: false,
    iconId: 'lucide:map-pin',
    showAvatar: false,
    titleText: 'Delivery location updated',
    bodyText: (vars) =>
      `Your orders will be delivered to:\n\n${vars.address || 'your saved address'}\n\nYou can change this anytime from the location icon in the header.`,
    primaryLabel: 'Got it',
    primaryCtaId: 'popup_delivery_saved_ok',
  },

  account_overview: {
    popupId: 'account_overview',
    triggerType: 'user_action',
    blocksTask: false,
    iconId: 'lucide:user-circle',
    showAvatar: true,
    titleText: (vars) => `Hi, ${vars.displayName || 'there'}`,
    bodyText: (vars) =>
      `Signed in as ${vars.displayName || 'Guest'}${vars.email ? `\n${vars.email}` : ''}\n\nYour basket and delivery preferences are saved for this device.`,
    primaryLabel: 'Continue browsing',
    primaryCtaId: 'popup_account_continue',
  },

  guest_checkout: {
    popupId: 'guest_checkout',
    triggerType: 'user_action',
    blocksTask: true,
    iconId: 'lucide:log-in',
    showAvatar: false,
    titleText: 'Sign in to checkout',
    bodyText:
      'You need a QuickBite account to place an order. Your basket items will stay saved while you sign in.\n\nThis step is the same for all participants.',
    primaryLabel: 'Go to sign in',
    primaryCtaId: 'popup_guest_checkout_login',
    secondaryLabel: 'Stay on basket',
    secondaryCtaId: 'popup_guest_checkout_cancel',
  },

  secure_payment_info: {
    popupId: 'secure_payment_info',
    triggerType: 'user_action',
    blocksTask: false,
    iconId: 'lucide:shield-check',
    showAvatar: false,
    titleText: 'Secure checkout (demo)',
    bodyText:
      'Payment fields on this page are for demonstration only. No real card data is sent to a payment provider and no money is charged.\n\nUse Fill demo card, or enter any valid-format test details (e.g. 4242 4242 4242 4242, 12/30, 123) to complete the practice order.',
    primaryLabel: 'Got it',
    primaryCtaId: 'popup_secure_payment_ok',
  },

  order_policy_info: {
    popupId: 'order_policy_info',
    triggerType: 'user_action',
    blocksTask: false,
    iconId: 'lucide:store',
    showAvatar: false,
    titleText: 'How ordering works',
    bodyText: (vars) => {
      const restaurantLine = vars.restaurantName
        ? `Your current basket is from ${vars.restaurantName}. `
        : ''
      return `${restaurantLine}QuickBite allows one restaurant per order. Delivery and service fees are shown before you pay. Promo code WELCOME10 applies on orders over £30.`
    },
    primaryLabel: 'Got it',
    primaryCtaId: 'popup_order_policy_ok',
  },

  location_required: {
    popupId: 'location_required',
    triggerType: 'user_action',
    blocksTask: false,
    iconId: 'lucide:navigation',
    showAvatar: false,
    titleText: 'Set a delivery location',
    bodyText:
      'Enter your address or postcode on the homepage to see restaurants that deliver to you. This helps us show relevant menus in your area.',
    primaryLabel: 'Got it',
    primaryCtaId: 'popup_location_required_ok',
  },

  basket_restaurant_conflict: {
    popupId: 'basket_restaurant_conflict',
    triggerType: 'user_action',
    blocksTask: true,
    iconId: 'lucide:shopping-bag',
    showAvatar: false,
    titleText: 'One restaurant per order',
    bodyText: (vars) =>
      `You already have items from ${vars.currentRestaurant || 'another restaurant'}${
        vars.newRestaurant ? ` in your basket. Finish or clear that order before adding from ${vars.newRestaurant}.` : '.'
      }`,
    primaryLabel: 'View basket',
    primaryCtaId: 'popup_view_basket',
    note: 'Full actions handled by RestaurantBasketPopup.jsx — this catalog entry is for documentation only.',
  },
}

export function resolvePopupText(value, vars = {}) {
  if (typeof value === 'function') return value(vars)
  return value || ''
}

export function getPopupDefinition(popupId) {
  return popupCatalog[popupId] || null
}
