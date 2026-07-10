import { getPhotoByCategoryIndex } from './foodImages'

// each product has its own photo (even within the same category)
const productData = [
  {
    productId: 'p1',
    productName: 'Margherita Pizza',
    productDescription: 'Tomato, mozzarella and fresh basil on a thin crust.',
    unitPrice: 9.99,
    categoryTag: 'Pizza',
  },
  {
    productId: 'p2',
    productName: 'Pepperoni Pizza',
    productDescription: 'Classic pepperoni with melted cheese.',
    unitPrice: 11.49,
    categoryTag: 'Pizza',
  },
  {
    productId: 'p3',
    productName: 'Classic Cheeseburger',
    productDescription: 'Beef patty, cheddar, lettuce and house sauce.',
    unitPrice: 8.99,
    categoryTag: 'Burgers',
  },
  {
    productId: 'p4',
    productName: 'Bacon Burger',
    productDescription: 'Double cheese with crispy bacon.',
    unitPrice: 10.49,
    categoryTag: 'Burgers',
  },
  {
    productId: 'p9',
    productName: 'BBQ Smash Burger',
    productDescription: 'Smashed patty with BBQ sauce and pickles.',
    unitPrice: 9.49,
    categoryTag: 'Burgers',
  },
  {
    productId: 'p10',
    productName: 'Mushroom Swiss Burger',
    productDescription: 'Grilled mushrooms and swiss cheese.',
    unitPrice: 10.99,
    categoryTag: 'Burgers',
  },
  {
    productId: 'p5',
    productName: 'Salmon Sushi Set',
    productDescription: 'Eight pieces of fresh salmon nigiri.',
    unitPrice: 12.99,
    categoryTag: 'Sushi',
  },
  {
    productId: 'p6',
    productName: 'California Roll',
    productDescription: 'Crab, avocado and cucumber roll.',
    unitPrice: 8.49,
    categoryTag: 'Sushi',
  },
  {
    productId: 'p11',
    productName: 'Tuna Dragon Roll',
    productDescription: 'Spicy tuna with avocado and eel sauce.',
    unitPrice: 11.99,
    categoryTag: 'Sushi',
  },
  {
    productId: 'p12',
    productName: 'Veggie Maki Box',
    productDescription: 'Cucumber, avocado and pickled radish rolls.',
    unitPrice: 7.99,
    categoryTag: 'Sushi',
  },
  {
    productId: 'p7',
    productName: 'Caesar Salad',
    productDescription: 'Romaine, parmesan and croutons.',
    unitPrice: 7.99,
    categoryTag: 'Salads',
  },
  {
    productId: 'p8',
    productName: 'Chocolate Cake',
    productDescription: 'Rich chocolate sponge with cream.',
    unitPrice: 5.99,
    categoryTag: 'Desserts',
  },
  {
    productId: 'p13',
    productName: 'Chicken Ramen',
    productDescription: 'Broth, noodles and soft egg.',
    unitPrice: 10.49,
    categoryTag: 'Asian',
  },
  {
    productId: 'p14',
    productName: 'Club Sandwich',
    productDescription: 'Chicken, bacon, lettuce and tomato.',
    unitPrice: 7.49,
    categoryTag: 'Sandwiches',
  },
]

const productCategoryCounts = {}

export const productList = productData.map((product) => {
  const indexInCategory = productCategoryCounts[product.categoryTag] || 0
  productCategoryCounts[product.categoryTag] = indexInCategory + 1

  return {
    ...product,
    imagePath: getPhotoByCategoryIndex(product.categoryTag, indexInCategory),
  }
})

export function getProductById(productId) {
  return productList.find((p) => p.productId === productId) || null
}
