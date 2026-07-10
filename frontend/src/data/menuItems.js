// mock dishes per cuisine — ratings/eta on restaurants are also mocked in osm fetch
const dishTemplates = {
  Pizza: [
    { dishName: 'Margherita Pizza', dishPrice: 9.99 },
    { dishName: 'Pepperoni Feast', dishPrice: 11.49 },
    { dishName: 'Garlic Bread', dishPrice: 4.5 },
  ],
  Burgers: [
    { dishName: 'Classic Cheeseburger', dishPrice: 8.99 },
    { dishName: 'Bacon BBQ Burger', dishPrice: 10.49 },
    { dishName: 'Crispy Fries', dishPrice: 3.49 },
  ],
  Sushi: [
    { dishName: 'Salmon Nigiri Set', dishPrice: 12.99 },
    { dishName: 'California Roll', dishPrice: 8.49 },
    { dishName: 'Miso Soup', dishPrice: 3.99 },
  ],
  Desserts: [
    { dishName: 'Chocolate Lava Cake', dishPrice: 6.49 },
    { dishName: 'Vanilla Cheesecake', dishPrice: 5.99 },
    { dishName: 'Berry Sundae', dishPrice: 4.99 },
  ],
  Salads: [
    { dishName: 'Caesar Salad', dishPrice: 7.99 },
    { dishName: 'Greek Salad Bowl', dishPrice: 8.49 },
    { dishName: 'Avocado Toast', dishPrice: 6.49 },
  ],
  Asian: [
    { dishName: 'Chicken Ramen', dishPrice: 10.99 },
    { dishName: 'Pad Thai', dishPrice: 9.49 },
    { dishName: 'Spring Rolls', dishPrice: 5.49 },
  ],
  Sandwiches: [
    { dishName: 'Club Sandwich', dishPrice: 7.49 },
    { dishName: 'BLT Melt', dishPrice: 6.99 },
    { dishName: 'Soup of the Day', dishPrice: 4.49 },
  ],
  General: [
    { dishName: 'Chef Special', dishPrice: 9.99 },
    { dishName: 'House Salad', dishPrice: 5.99 },
    { dishName: 'Soft Drink', dishPrice: 2.49 },
  ],
}

export function buildMenuForRestaurant(restaurant, restaurantKey) {
  const categoryTag = restaurant.categoryTag || 'General'
  const template = dishTemplates[categoryTag] || dishTemplates.General

  return template.map((dish, index) => ({
    cartLineId: `${restaurantKey}-${index}`,
    dishName: dish.dishName,
    dishPrice: dish.dishPrice,
    restaurantName: restaurant.restaurantName,
    categoryTag,
    imageSearch: `${categoryTag.toLowerCase()} ${dish.dishName}`,
  }))
}

export function buildAllDishes(restaurantList, getRestaurantKey) {
  return restaurantList.flatMap((restaurant) =>
    buildMenuForRestaurant(restaurant, getRestaurantKey(restaurant))
  )
}
