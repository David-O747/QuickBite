export function getRestaurantKey(restaurant) {
  return String(restaurant.osmPlaceId || restaurant.restaurantName)
}
