export function highlightMatch(text, query) {
  if (!query) return [{ text, bold: false }]
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const startIndex = lowerText.indexOf(lowerQuery)
  if (startIndex === -1) return [{ text, bold: false }]

  return [
    { text: text.slice(0, startIndex), bold: false },
    { text: text.slice(startIndex, startIndex + query.length), bold: true },
    { text: text.slice(startIndex + query.length), bold: false },
  ]
}

export function runSearch(query, restaurantList, dishList, getRestaurantKey) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return { restaurants: [], dishes: [] }

  const restaurants = restaurantList
    .filter(
      (r) =>
        r.restaurantName.toLowerCase().includes(trimmed) ||
        r.cuisineLabel.toLowerCase().includes(trimmed) ||
        (r.categoryTag || '').toLowerCase().includes(trimmed)
    )
    .slice(0, 6)
    .map((r) => ({ type: 'restaurant', item: r, key: getRestaurantKey(r) }))

  const dishes = dishList
    .filter((d) => d.dishName.toLowerCase().includes(trimmed))
    .slice(0, 6)
    .map((d) => ({ type: 'dish', item: d, key: d.cartLineId }))

  return { restaurants, dishes }
}

export function filterRestaurants(restaurantList, categoryFilter, searchQuery) {
  let filtered = [...restaurantList]

  if (categoryFilter) {
    filtered = filtered.filter(
      (r) =>
        r.categoryTag === categoryFilter ||
        r.cuisineLabel.toLowerCase().includes(categoryFilter.toLowerCase())
    )
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.restaurantName.toLowerCase().includes(q) ||
        r.cuisineLabel.toLowerCase().includes(q)
    )
  }

  return filtered
}
