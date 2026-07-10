import { getPhotoByCategoryIndex } from './foodImages'

const menuTemplates = {
  Pizza: {
    description:
      'Wood-fired pizzas, fresh dough daily, and classic Italian sides made to order.',
    popular: [
      { name: 'Margherita Classic', desc: 'Tomato, mozzarella and fresh basil.', price: 11.5, badge: 'MUST TRY' },
      { name: 'Pepperoni Feast', desc: 'Loaded pepperoni with extra cheese.', price: 13.5 },
      { name: 'BBQ Chicken Pizza', desc: 'Smoky BBQ base with grilled chicken.', price: 14.0, badge: 'MUST TRY' },
      { name: 'Four Cheese', desc: 'Mozzarella, cheddar, gorgonzola and parmesan.', price: 13.0 },
    ],
    mains: [
      { name: 'Meat Lovers Platter', desc: 'Pepperoni, sausage, ham and beef.', price: 16.5, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Veggie Supreme', desc: 'Peppers, olives, mushrooms and onion.', price: 12.5 },
      { name: 'Calzone Bake', desc: 'Folded pizza stuffed with ricotta and ham.', price: 13.5 },
    ],
    sides: [
      { name: 'Garlic Bread', price: 4.5 },
      { name: 'Cheesy Dough Balls', price: 5.0 },
      { name: 'Potato Wedges', price: 4.0 },
      { name: 'Side Salad', price: 3.5 },
      { name: 'Coleslaw', price: 3.0 },
      { name: 'Mozzarella Sticks', price: 5.5 },
    ],
    beverages: [
      { name: 'Cola', price: 2.5 },
      { name: 'Sparkling Water', price: 2.0 },
      { name: 'Lemonade', price: 2.5 },
    ],
    desserts: [
      { name: 'Chocolate Brownie', price: 5.5 },
      { name: 'Tiramisu Cup', price: 6.0 },
    ],
  },
  Burgers: {
    description:
      'Artisanal burgers made with organic beef, toasted brioche buns, and house sauces.',
    popular: [
      { name: 'The Classic Beast', desc: 'Beef patty, cheddar, lettuce and house sauce.', price: 12.5, badge: 'MUST TRY' },
      { name: 'Bacon Stack', desc: 'Double patty with crispy bacon.', price: 14.5, badge: 'MUST TRY' },
      { name: 'Mushroom Swiss', desc: 'Grilled mushrooms and swiss cheese.', price: 13.0 },
      { name: 'Spicy Jalapeño', desc: 'Pepper jack, jalapeños and chipotle mayo.', price: 13.5 },
    ],
    mains: [
      { name: 'Grill Master Platter', desc: 'Two burgers, fries and onion rings.', price: 24.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Chicken Burger', desc: 'Crispy chicken fillet with slaw.', price: 11.5 },
      { name: 'Plant Burger', desc: 'Plant-based patty with avocado.', price: 12.0 },
    ],
    sides: [
      { name: 'Onion Rings', price: 4.5 },
      { name: 'Loaded Fries', price: 5.5 },
      { name: 'Sweet Potato Fries', price: 5.0 },
      { name: 'Corn on the Cob', price: 3.5 },
      { name: 'Pickle Pot', price: 2.5 },
      { name: 'Slaw Cup', price: 3.0 },
    ],
    beverages: [
      { name: 'Milkshake', price: 4.5 },
      { name: 'Iced Tea', price: 2.5 },
      { name: 'Cola', price: 2.5 },
    ],
    desserts: [
      { name: 'Cookie Dough Pot', price: 5.5 },
      { name: 'Ice Cream Scoop', price: 4.0 },
    ],
  },
  Sushi: {
    description:
      'Fresh sushi, nigiri and rolls prepared daily with premium fish and rice.',
    popular: [
      { name: 'Salmon Nigiri Set', desc: 'Eight pieces of fresh salmon nigiri.', price: 12.99, badge: 'MUST TRY' },
      { name: 'California Roll', desc: 'Crab, avocado and cucumber.', price: 8.49 },
      { name: 'Dragon Roll', desc: 'Eel, avocado and eel sauce.', price: 13.5, badge: 'MUST TRY' },
      { name: 'Tuna Maki', desc: 'Classic tuna roll with soy.', price: 7.99 },
    ],
    mains: [
      { name: 'Sushi Platter Deluxe', desc: 'Chef selection of 24 pieces.', price: 28.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Salmon Teriyaki Bowl', desc: 'Rice bowl with glazed salmon.', price: 14.5 },
      { name: 'Veggie Sushi Box', desc: 'Avocado, cucumber and pickled radish.', price: 11.0 },
    ],
    sides: [
      { name: 'Miso Soup', price: 3.5 },
      { name: 'Edamame', price: 4.0 },
      { name: 'Seaweed Salad', price: 4.5 },
      { name: 'Gyoza (4)', price: 5.5 },
      { name: 'Pickled Ginger', price: 2.0 },
      { name: 'Prawn Crackers', price: 3.0 },
    ],
    beverages: [
      { name: 'Green Tea', price: 2.5 },
      { name: 'Ramune', price: 3.0 },
      { name: 'Still Water', price: 2.0 },
    ],
    desserts: [
      { name: 'Mochi Ice Cream', price: 5.5 },
      { name: 'Matcha Cake', price: 6.0 },
    ],
  },
  Salads: {
    description:
      'Fresh bowls, crisp greens, and healthy plates made with seasonal produce.',
    popular: [
      { name: 'Caesar Bowl', desc: 'Romaine, parmesan and croutons.', price: 9.5, badge: 'MUST TRY' },
      { name: 'Greek Salad', desc: 'Feta, olives, cucumber and tomato.', price: 9.0 },
      { name: 'Avocado Power Bowl', desc: 'Quinoa, avocado and seeds.', price: 11.0, badge: 'MUST TRY' },
      { name: 'Chicken Cobb', desc: 'Chicken, egg, bacon and blue cheese.', price: 12.0 },
    ],
    mains: [
      { name: 'Harvest Platter', desc: 'Mixed bowls for sharing.', price: 22.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Salmon Superfood', desc: 'Salmon, kale and sweet potato.', price: 14.5 },
      { name: 'Falafel Bowl', desc: 'Falafel, hummus and pickled veg.', price: 10.5 },
    ],
    sides: [
      { name: 'Soup of the Day', price: 4.5 },
      { name: 'Hummus & Pitta', price: 4.0 },
      { name: 'Fruit Cup', price: 3.5 },
      { name: 'Seed Mix', price: 2.5 },
      { name: 'Garlic Pitta', price: 3.0 },
      { name: 'Yoghurt Dip', price: 2.5 },
    ],
    beverages: [
      { name: 'Green Juice', price: 4.0 },
      { name: 'Sparkling Water', price: 2.0 },
      { name: 'Iced Coffee', price: 3.5 },
    ],
    desserts: [
      { name: 'Fruit Yoghurt', price: 4.5 },
      { name: 'Energy Balls', price: 4.0 },
    ],
  },
  Desserts: {
    description:
      'Cakes, ice cream and sweet treats baked fresh for every order.',
    popular: [
      { name: 'Chocolate Lava Cake', desc: 'Warm cake with molten centre.', price: 6.5, badge: 'MUST TRY' },
      { name: 'Strawberry Cheesecake', desc: 'Creamy cheesecake with berry topping.', price: 6.0 },
      { name: 'Cookie Dough Pot', desc: 'Safe-to-eat cookie dough and cream.', price: 5.5, badge: 'MUST TRY' },
      { name: 'Brownie Slice', desc: 'Rich chocolate brownie.', price: 4.5 },
    ],
    mains: [
      { name: 'Dessert Sharing Board', desc: 'Chef selection of mini desserts.', price: 18.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Waffle Stack', desc: 'Waffles, syrup and ice cream.', price: 8.5 },
      { name: 'Pancake Tower', desc: 'Fluffy pancakes with berries.', price: 8.0 },
    ],
    sides: [
      { name: 'Ice Cream Scoop', price: 3.0 },
      { name: 'Whipped Cream', price: 1.5 },
      { name: 'Caramel Sauce', price: 1.5 },
      { name: 'Berry Mix', price: 2.5 },
      { name: 'Chocolate Sauce', price: 1.5 },
      { name: 'Nuts Topping', price: 2.0 },
    ],
    beverages: [
      { name: 'Hot Chocolate', price: 3.5 },
      { name: 'Milkshake', price: 4.5 },
      { name: 'Coffee', price: 2.5 },
    ],
    desserts: [
      { name: 'Macaron Box', price: 6.5 },
      { name: 'Lemon Tart', price: 5.5 },
    ],
  },
  Asian: {
    description:
      'Noodles, rice bowls and Asian favourites with bold sauces and fresh toppings.',
    popular: [
      { name: 'Chicken Ramen', desc: 'Broth, noodles and soft egg.', price: 11.5, badge: 'MUST TRY' },
      { name: 'Pad Thai', desc: 'Rice noodles with peanuts and lime.', price: 10.5 },
      { name: 'Beef Pho', desc: 'Aromatic broth with rice noodles.', price: 12.0, badge: 'MUST TRY' },
      { name: 'Katsu Curry', desc: 'Crispy chicken with Japanese curry.', price: 11.0 },
    ],
    mains: [
      { name: 'Asian Feast Platter', desc: 'Ramen, gyoza and rice for two.', price: 26.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Teriyaki Salmon', desc: 'Glazed salmon with sticky rice.', price: 14.5 },
      { name: 'Veggie Stir Fry', desc: 'Seasonal veg with noodles.', price: 10.0 },
    ],
    sides: [
      { name: 'Gyoza (5)', price: 5.5 },
      { name: 'Spring Rolls', price: 4.5 },
      { name: 'Egg Fried Rice', price: 4.0 },
      { name: 'Kimchi', price: 3.0 },
      { name: 'Miso Soup', price: 3.5 },
      { name: 'Prawn Toast', price: 5.0 },
    ],
    beverages: [
      { name: 'Jasmine Tea', price: 2.5 },
      { name: 'Bubble Tea', price: 4.5 },
      { name: 'Cola', price: 2.5 },
    ],
    desserts: [
      { name: 'Mango Pudding', price: 5.0 },
      { name: 'Sesame Balls', price: 4.5 },
    ],
  },
  Sandwiches: {
    description:
      'Freshly made sandwiches, melts and deli favourites on artisan bread.',
    popular: [
      { name: 'Club Sandwich', desc: 'Chicken, bacon, lettuce and tomato.', price: 9.5, badge: 'MUST TRY' },
      { name: 'BLT Melt', desc: 'Bacon, lettuce, tomato and cheese.', price: 8.5 },
      { name: 'Chicken Pesto Panini', desc: 'Grilled chicken with pesto.', price: 9.0, badge: 'MUST TRY' },
      { name: 'Tuna Mayo Sub', desc: 'Tuna, mayo and cucumber.', price: 8.0 },
    ],
    mains: [
      { name: 'Deli Platter', desc: 'Three sandwiches and sides.', price: 20.0, featured: true, badge: "CHEF'S SPECIAL" },
      { name: 'Steak Sandwich', desc: 'Sliced steak with onions.', price: 12.5 },
      { name: 'Halloumi Wrap', desc: 'Grilled halloumi and salad.', price: 9.5 },
    ],
    sides: [
      { name: 'Crisps', price: 2.0 },
      { name: 'Soup Cup', price: 3.5 },
      { name: 'Side Salad', price: 3.5 },
      { name: 'Pickle Spear', price: 1.5 },
      { name: 'Coleslaw', price: 2.5 },
      { name: 'Fries', price: 3.5 },
    ],
    beverages: [
      { name: 'Fresh Orange Juice', price: 3.5 },
      { name: 'Coffee', price: 2.5 },
      { name: 'Water', price: 2.0 },
    ],
    desserts: [
      { name: 'Cookie', price: 2.5 },
      { name: 'Brownie', price: 3.5 },
    ],
  },
}

function hashText(text) {
  let hash = 0
  const value = String(text)
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function shiftItems(items, shiftBy) {
  if (!items.length) return items
  const offset = shiftBy % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

function mapMenuItems(items, restaurantId, sectionKey, categoryTag, priceShift = 0) {
  return items.map((item, index) => {
    const productId = `${restaurantId}-${sectionKey}-${index}`
    return {
      productId,
      productName: item.name,
      productDescription: item.desc || '',
      unitPrice: Number((item.price + priceShift).toFixed(2)),
      categoryTag,
      menuSection: sectionKey,
      imagePath: getPhotoByCategoryIndex(categoryTag, index + hashText(restaurantId) % 5),
      badgeLabel: item.badge || null,
      isFeatured: Boolean(item.featured),
      restaurantId,
    }
  })
}

export function buildMenuForRestaurant(restaurant) {
  const categoryTag = restaurant.categoryTag || 'Pizza'
  const template = menuTemplates[categoryTag] || menuTemplates.Pizza
  const shiftBy = hashText(restaurant.restaurantId || restaurant.restaurantName)
  const priceShift = (shiftBy % 3) * 0.5

  const popularSource = shiftItems(template.popular, shiftBy)
  const mainsSource = shiftItems(template.mains, shiftBy)
  const sidesSource = shiftItems(template.sides, shiftBy)
  const beveragesSource = shiftItems(template.beverages, shiftBy)
  const dessertsSource = shiftItems(template.desserts, shiftBy)

  return {
    restaurantDescription: template.description,
    popularItems: mapMenuItems(popularSource, restaurant.restaurantId, 'popular', categoryTag, priceShift),
    mainCourses: mapMenuItems(mainsSource, restaurant.restaurantId, 'mains', categoryTag, priceShift),
    sideItems: mapMenuItems(sidesSource, restaurant.restaurantId, 'sides', categoryTag, priceShift),
    beverageItems: mapMenuItems(beveragesSource, restaurant.restaurantId, 'beverages', categoryTag, priceShift),
    dessertItems: mapMenuItems(dessertsSource, restaurant.restaurantId, 'desserts', 'Desserts', priceShift),
  }
}

export function getRestaurantFromStorage(restaurantId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem('qb_selected_restaurant') || 'null')
    if (saved && saved.restaurantId === restaurantId) return saved
  } catch {
  }
  return null
}

export function saveRestaurantToStorage(restaurant) {
  sessionStorage.setItem('qb_selected_restaurant', JSON.stringify(restaurant))
}

export function saveMenuReturnPath(path) {
  sessionStorage.setItem('qb_menu_return', path || '/')
}

export function getMenuReturnPath() {
  return sessionStorage.getItem('qb_menu_return') || '/'
}
