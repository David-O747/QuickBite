import { getCategoryPhoto, getPhotoByCategoryIndex } from './foodImages'

export const localPhotos = {
  heroBackground: '/images/pizza.png',
  burgerPhoto: '/images/burger.png',
  pizzaPhoto: '/images/pizza.png',
  pizzaCategory: '/images/pizza-icon.png',
  locationIcon: '/images/gps.png',
  basketIcon: '/images/shopping-cart.png',
  profileIcon: '/images/profile.png',
}

export const foodCategories = [
  { categoryName: 'Pizza', imagePath: getCategoryPhoto('Pizza') },
  { categoryName: 'Burgers', imagePath: getCategoryPhoto('Burgers') },
  { categoryName: 'Sushi', imagePath: getCategoryPhoto('Sushi') },
  { categoryName: 'Desserts', imagePath: getCategoryPhoto('Desserts') },
  { categoryName: 'Salads', imagePath: getCategoryPhoto('Salads') },
  { categoryName: 'Asian', imagePath: getCategoryPhoto('Asian') },
  { categoryName: 'Sandwiches', imagePath: getCategoryPhoto('Sandwiches') },
]

const defaultPlaceNames = [
  ['The Bistro Kitchen', 'Pizza'],
  ['Burger House', 'Burgers'],
  ['Sushi Express', 'Sushi'],
  ['Green Bowl', 'Salads'],
  ['Sweet Spot', 'Desserts'],
  ['Noodle Lane', 'Asian'],
  ['Maple Street Pizza', 'Pizza'],
  ['Honest Burgers', 'Burgers'],
  ['Tokyo Rolls', 'Sushi'],
  ['Leaf & Grain', 'Salads'],
  ['Cocoa Crumb', 'Desserts'],
  ['Golden Wok', 'Asian'],
  ['Club Stack', 'Sandwiches'],
  ['Fire Oven', 'Pizza'],
  ['Stack Yard', 'Burgers'],
  ['Sakura Box', 'Sushi'],
  ['Garden Plate', 'Salads'],
  ['Sugar House', 'Desserts'],
  ['Bamboo Bowl', 'Asian'],
  ['Deli Corner', 'Sandwiches'],
  ['Roma Slice', 'Pizza'],
  ['Patty Lab', 'Burgers'],
  ['Ocean Roll', 'Sushi'],
  ['Crisp Kitchen', 'Salads'],
]

const categoryCounts = {}

export const restaurantList = defaultPlaceNames.map(([restaurantName, categoryTag], index) => {
  const restaurantId = `r${index + 1}`
  const indexInCategory = categoryCounts[categoryTag] || 0
  categoryCounts[categoryTag] = indexInCategory + 1

  return {
    restaurantId,
    restaurantName,
    cuisineLabel: `${categoryTag} • Local`,
    categoryTag,
    deliveryMinutes: `${15 + (index % 15)}-${25 + (index % 15)} min`,
    deliveryFee: index % 3 === 0 ? 'Free' : `£${(1.5 + (index % 3)).toFixed(2)}`,
    ratingScore: (4.3 + (index % 7) / 10).toFixed(1),
    reviewCount: 120 + index * 17,
    imagePath: getPhotoByCategoryIndex(categoryTag, indexInCategory),
    isFeatured: index < 2,
  }
})
