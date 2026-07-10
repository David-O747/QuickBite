// OpenStreetMap Overpass — free restaurants near a lat/lng (no API key)
import { getPhotoByCategoryIndex } from '../data/foodImages'

const categoryTags = ['Pizza', 'Burgers', 'Sushi', 'Desserts', 'Salads', 'Asian', 'Sandwiches']

export const mapCentre = {
  latitude: 51.5074,
  longitude: -0.1278,
}

export async function fetchOsmRestaurantsNear(
  latitude,
  longitude,
  resultLimit = 90,
  searchRadiusMetres = 8000
) {
  const overpassQuery = `
    [out:json][timeout:30];
    (
      node["amenity"~"restaurant|fast_food|cafe|pub|bar"]["name"](around:${searchRadiusMetres},${latitude},${longitude});
      way["amenity"~"restaurant|fast_food|cafe|pub|bar"]["name"](around:${searchRadiusMetres},${latitude},${longitude});
    );
    out center ${resultLimit};
  `

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    if (!response.ok) return []

    const mapData = await response.json()
    return parseOsmPlaces(mapData.elements || []).slice(0, resultLimit)
  } catch {
    return []
  }
}

export async function fetchOsmRestaurants(resultLimit = 90) {
  return fetchOsmRestaurantsNear(mapCentre.latitude, mapCentre.longitude, resultLimit)
}

function parseOsmPlaces(placeList) {
  const seenNames = new Set()
  const uniquePlaces = []
  const categoryCounts = {}

  for (const place of placeList) {
    const lat = place.lat ?? place.center?.lat
    const lon = place.lon ?? place.center?.lon
    const name = place.tags?.name
    if (!lat || !lon || !name) continue

    const nameKey = name.toLowerCase()
    if (seenNames.has(nameKey)) continue
    seenNames.add(nameKey)

    const categoryTag = mapCuisineToCategory(place.tags.cuisine || place.tags.amenity || '')
    const placeId = place.id
    const restaurantId = `osm-${placeId}`
    const indexInCategory = categoryCounts[categoryTag] || 0
    categoryCounts[categoryTag] = indexInCategory + 1

    uniquePlaces.push({
      restaurantId,
      osmPlaceId: placeId,
      restaurantName: name,
      cuisineLabel: formatCuisineLabel(place.tags),
      categoryTag,
      mapLatitude: lat,
      mapLongitude: lon,
      deliveryMinutes: `${15 + (placeId % 20)}-${25 + (placeId % 20)} min`,
      deliveryFee: placeId % 3 === 0 ? 'Free' : `£${(1 + (placeId % 4) * 0.5).toFixed(2)}`,
      ratingScore: (4 + (placeId % 10) / 10).toFixed(1),
      reviewCount: 120 + (placeId % 400),
      // photo matches category, different image for each place in that category
      imagePath: getPhotoByCategoryIndex(categoryTag, indexInCategory),
      isFeatured: uniquePlaces.length < 3,
    })
  }

  return uniquePlaces
}

function mapCuisineToCategory(cuisineRaw) {
  const cuisine = cuisineRaw.toLowerCase()
  if (cuisine.includes('pizza') || cuisine.includes('italian')) return 'Pizza'
  if (cuisine.includes('burger') || cuisine.includes('american')) return 'Burgers'
  if (cuisine.includes('sushi') || cuisine.includes('japanese')) return 'Sushi'
  if (cuisine.includes('dessert') || cuisine.includes('cake') || cuisine.includes('bakery')) return 'Desserts'
  if (cuisine.includes('salad') || cuisine.includes('vegan') || cuisine.includes('healthy')) return 'Salads'
  if (cuisine.includes('sandwich')) return 'Sandwiches'
  if (
    cuisine.includes('chinese') ||
    cuisine.includes('thai') ||
    cuisine.includes('indian') ||
    cuisine.includes('asian')
  ) {
    return 'Asian'
  }
  return categoryTags[Math.abs(cuisine.length) % categoryTags.length]
}

function formatCuisineLabel(placeTags) {
  const cuisineType = placeTags.cuisine || placeTags.amenity || 'restaurant'
  const formattedType = cuisineType.replace(/_/g, ' ')
  return `${formattedType.charAt(0).toUpperCase()}${formattedType.slice(1)} • Local`
}
