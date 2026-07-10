export function hasBasketFromOtherRestaurant(app, restaurantId) {
  return (
    app.basketItemCount > 0 &&
    app.basketRestaurantId &&
    app.basketRestaurantId !== restaurantId
  )
}
