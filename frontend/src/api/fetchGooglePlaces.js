// Google Places API integration for London restaurants
// Note: You need to get a Google Places API key from Google Cloud Console
// Enable: Places API, Geocoding API, Maps JavaScript API

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''
const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 } // London coordinates
const SEARCH_RADIUS = 5000 // 5km radius from London center

// London restaurant categories for Google Places
const LONDON_RESTAURANT_TYPES = [
  'restaurant',
  'cafe',
  'bakery',
  'meal_delivery',
  'meal_takeaway',
  'food',
  'pizza',
  'burger',
  'sushi',
  'asian_restaurant',
  'indian_restaurant',
  'italian_restaurant',
  'chinese_restaurant',
  'japanese_restaurant',
  'thai_restaurant',
  'mexican_restaurant',
  'vegetarian_restaurant',
  'vegan_restaurant'
]

// Map Google Places types to our category tags
const GOOGLE_TO_CATEGORY_MAP = {
  'pizza': 'Pizza',
  'burger': 'Burgers',
  'sushi': 'Sushi',
  'indian_restaurant': 'Asian',
  'chinese_restaurant': 'Asian',
  'japanese_restaurant': 'Sushi',
  'thai_restaurant': 'Asian',
  'italian_restaurant': 'Pizza',
  'mexican_restaurant': 'Sandwiches',
  'vegetarian_restaurant': 'Salads',
  'vegan_restaurant': 'Salads',
  'bakery': 'Desserts',
  'cafe': 'Desserts',
  'restaurant': 'Asian', // default
  'meal_delivery': 'Asian',
  'meal_takeaway': 'Asian',
  'food': 'Asian'
}

// Fetch restaurants from Google Places API
export async function fetchGooglePlacesRestaurants(resultLimit = 20) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
    console.warn('Google Places API key not found. Using fallback London restaurants.')
    return getLondonFallbackRestaurants(resultLimit)
  }

  try {
    // Use Google Places Text Search API (more flexible than Nearby Search)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+London&location=${LONDON_CENTER.lat},${LONDON_CENTER.lng}&radius=${SEARCH_RADIUS}&key=${GOOGLE_API_KEY}`
    
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API status: ${data.status}`)
    }
    
    const places = data.results || []
    
    // If we have places, process them
    if (places.length > 0) {
      return processGooglePlaces(places.slice(0, resultLimit))
    }
    
    // If no results, use fallback
    return getLondonFallbackRestaurants(resultLimit)
    
  } catch (error) {
    console.error('Error fetching Google Places data:', error)
    return getLondonFallbackRestaurants(resultLimit)
  }
}

// Process Google Places API results into our restaurant format
function processGooglePlaces(places) {
  return places.map((place, index) => {
    // Determine category from Google Places types
    const placeTypes = place.types || []
    let categoryTag = 'Asian' // default
    
    for (const type of placeTypes) {
      if (GOOGLE_TO_CATEGORY_MAP[type]) {
        categoryTag = GOOGLE_TO_CATEGORY_MAP[type]
        break
      }
    }
    
    // Get photo reference if available
    let photoUrl = null
    if (place.photos && place.photos.length > 0) {
      const photoRef = place.photos[0].photo_reference
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
    }
    
    // Format cuisine/label
    const cuisineTypes = placeTypes
      .filter(type => type.includes('restaurant') || type.includes('food'))
      .map(type => type.replace(/_/g, ' '))
      .slice(0, 2)
    
    const cuisineLabel = cuisineTypes.length > 0 
      ? cuisineTypes.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' • ')
      : 'Restaurant • London'
    
    // Generate realistic delivery times and fees based on rating
    const rating = place.rating || 4.0
    const userRatingsTotal = place.user_ratings_total || 100
    
    // Better restaurants have faster delivery and lower fees
    const deliveryTimeBase = rating > 4.5 ? 15 : rating > 4.0 ? 20 : 25
    const deliveryMinutes = `${deliveryTimeBase}-${deliveryTimeBase + 10} min`
    const deliveryFee = rating > 4.5 ? 'Free' : `£${(1.99 + (index % 3)).toFixed(2)}`
    
    return {
      googlePlaceId: place.place_id,
      restaurantName: place.name,
      cuisineLabel: `${cuisineLabel} • ${place.price_level ? '£'.repeat(place.price_level) : '$'}`,
      categoryTag,
      mapLatitude: place.geometry?.location?.lat || LONDON_CENTER.lat + (Math.random() - 0.5) * 0.05,
      mapLongitude: place.geometry?.location?.lng || LONDON_CENTER.lng + (Math.random() - 0.5) * 0.05,
      deliveryMinutes,
      deliveryFee,
      ratingScore: rating.toFixed(1),
      reviewCount: userRatingsTotal,
      photoUrl, // Google Places photo URL
      unsplashSearch: `${categoryTag.toLowerCase()} restaurant london`,
      isFeatured: index < 3, // First 3 are featured
      address: place.formatted_address,
      openingHours: place.opening_hours?.open_now ? 'Open Now' : 'Closed',
      phone: place.formatted_phone_number
    }
  })
}

// Fallback London restaurants (used when API key is not set)
function getLondonFallbackRestaurants(resultLimit) {
  const londonRestaurants = [
    {
      restaurantName: 'Dishoom Covent Garden',
      cuisineLabel: 'Indian • Breakfast • $$',
      categoryTag: 'Asian',
      deliveryMinutes: '20-30 min',
      deliveryFee: 'Free',
      ratingScore: '4.7',
      reviewCount: 12500,
      unsplashSearch: 'dishoom london indian restaurant',
      mapLatitude: 51.5115,
      mapLongitude: -0.1240,
      isFeatured: true,
    },
    {
      restaurantName: 'Flat Iron Steak',
      cuisineLabel: 'Steak • British • $$',
      categoryTag: 'Burgers',
      deliveryMinutes: '25-35 min',
      deliveryFee: '£1.99',
      ratingScore: '4.6',
      reviewCount: 8900,
      unsplashSearch: 'flat iron steak london',
      mapLatitude: 51.5130,
      mapLongitude: -0.1265,
      isFeatured: true,
    },
    {
      restaurantName: 'Franco Manca',
      cuisineLabel: 'Pizza • Italian • $',
      categoryTag: 'Pizza',
      deliveryMinutes: '15-25 min',
      deliveryFee: 'Free',
      ratingScore: '4.5',
      reviewCount: 7500,
      unsplashSearch: 'franco manca pizza london',
      mapLatitude: 51.5145,
      mapLongitude: -0.1235,
      isFeatured: true,
    },
    {
      restaurantName: 'Bao Borough',
      cuisineLabel: 'Taiwanese • Buns • $$',
      categoryTag: 'Asian',
      deliveryMinutes: '30-40 min',
      deliveryFee: '£2.50',
      ratingScore: '4.8',
      reviewCount: 6200,
      unsplashSearch: 'bao borough london',
      mapLatitude: 51.5054,
      mapLongitude: -0.0915,
      isFeatured: false,
    },
    {
      restaurantName: 'Padella',
      cuisineLabel: 'Italian • Pasta • $$',
      categoryTag: 'Pizza',
      deliveryMinutes: '35-45 min',
      deliveryFee: '£2.99',
      ratingScore: '4.9',
      reviewCount: 10500,
      unsplashSearch: 'padella pasta london',
      mapLatitude: 51.5060,
      mapLongitude: -0.0900,
      isFeatured: false,
    },
    {
      restaurantName: 'Burger & Lobster',
      cuisineLabel: 'Burgers • Seafood • $$$',
      categoryTag: 'Burgers',
      deliveryMinutes: '20-30 min',
      deliveryFee: 'Free',
      ratingScore: '4.4',
      reviewCount: 8300,
      unsplashSearch: 'burger lobster london',
      mapLatitude: 51.5120,
      mapLongitude: -0.1280,
      isFeatured: false,
    },
    {
      restaurantName: 'Roti King',
      cuisineLabel: 'Malaysian • Roti • $',
      categoryTag: 'Asian',
      deliveryMinutes: '25-35 min',
      deliveryFee: '£1.50',
      ratingScore: '4.7',
      reviewCount: 5200,
      unsplashSearch: 'roti king london malaysian',
      mapLatitude: 51.5250,
      mapLongitude: -0.1245,
      isFeatured: false,
    },
    {
      restaurantName: 'Pizza Pilgrims',
      cuisineLabel: 'Pizza • Neapolitan • $',
      categoryTag: 'Pizza',
      deliveryMinutes: '15-25 min',
      deliveryFee: 'Free',
      ratingScore: '4.6',
      reviewCount: 6800,
      unsplashSearch: 'pizza pilgrims london',
      mapLatitude: 51.5135,
      mapLongitude: -0.1270,
      isFeatured: false,
    },
    {
      restaurantName: 'Katsute 100',
      cuisineLabel: 'Japanese • Desserts • $$',
      categoryTag: 'Desserts',
      deliveryMinutes: '30-40 min',
      deliveryFee: '£2.99',
      ratingScore: '4.8',
      reviewCount: 3200,
      unsplashSearch: 'katsute 100 london japanese',
      mapLatitude: 51.5200,
      mapLongitude: -0.1180,
      isFeatured: false,
    },
    {
      restaurantName: 'The Athenian',
      cuisineLabel: 'Greek • Street Food • $',
      categoryTag: 'Sandwiches',
      deliveryMinutes: '20-30 min',
      deliveryFee: '£1.99',
      ratingScore: '4.5',
      reviewCount: 4100,
      unsplashSearch: 'the athenian london greek',
      mapLatitude: 51.5150,
      mapLongitude: -0.1220,
      isFeatured: false,
    },
    {
      restaurantName: 'Honest Burgers',
      cuisineLabel: 'Burgers • British • $$',
      categoryTag: 'Burgers',
      deliveryMinutes: '18-28 min',
      deliveryFee: 'Free',
      ratingScore: '4.6',
      reviewCount: 9500,
      unsplashSearch: 'honest burgers london',
      mapLatitude: 51.5090,
      mapLongitude: -0.1250,
      isFeatured: false,
    },
    {
      restaurantName: 'Wingmans',
      cuisineLabel: 'American • Chicken • $$',
      categoryTag: 'Burgers',
      deliveryMinutes: '25-35 min',
      deliveryFee: '£2.50',
      ratingScore: '4.4',
      reviewCount: 2800,
      unsplashSearch: 'wingmans london chicken',
      mapLatitude: 51.5070,
      mapLongitude: -0.1210,
      isFeatured: false,
    },
    {
      restaurantName: 'Tonkotsu',
      cuisineLabel: 'Japanese • Ramen • $$',
      categoryTag: 'Asian',
      deliveryMinutes: '30-40 min',
      deliveryFee: '£2.99',
      ratingScore: '4.7',
      reviewCount: 5900,
      unsplashSearch: 'tonkotsu ramen london',
      mapLatitude: 51.5110,
      mapLongitude: -0.1190,
      isFeatured: false,
    },
    {
      restaurantName: 'Gail\'s Bakery',
      cuisineLabel: 'Bakery • Breakfast • $',
      categoryTag: 'Desserts',
      deliveryMinutes: '15-25 min',
      deliveryFee: '£1.50',
      ratingScore: '4.5',
      reviewCount: 4700,
      unsplashSearch: 'gails bakery london',
      mapLatitude: 51.5160,
      mapLongitude: -0.1200,
      isFeatured: false,
    },
    {
      restaurantName: 'Wahaca',
      cuisineLabel: 'Mexican • Street Food • $$',
      categoryTag: 'Sandwiches',
      deliveryMinutes: '25-35 min',
      deliveryFee: '£2.50',
      ratingScore: '4.3',
      reviewCount: 7100,
      unsplashSearch: 'wahaca mexican london',
      mapLatitude: 51.5100,
      mapLongitude: -0.1170,
      isFeatured: false,
    }
  ]
  
  return londonRestaurants.slice(0, resultLimit)
}

// Get restaurant details by place ID (for when user clicks on a restaurant)
export async function getRestaurantDetails(placeId) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
    return null
  }
  
  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,photos,types,website&key=${GOOGLE_API_KEY}`
    
    const response = await fetch(detailsUrl)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.result
    }
    
    return null
  } catch (error) {
    console.error('Error fetching restaurant details:', error)
    return null
  }
}

// Search restaurants by name or cuisine
export async function searchGooglePlaces(query) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
    return getLondonFallbackRestaurants(10).filter(restaurant => 
      restaurant.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisineLabel.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}+restaurant+London&location=${LONDON_CENTER.lat},${LONDON_CENTER.lng}&radius=${SEARCH_RADIUS}&key=${GOOGLE_API_KEY}`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return processGooglePlaces(data.results.slice(0, 10))
    }
    
    return []
  } catch (error) {
    console.error('Error searching Google Places:', error)
    return []
  }
}