export async function geocodeAddress(addressText) {
  const query = addressText.trim()
  if (!query) return null

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=gb&q=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) return null

    const results = await response.json()
    if (!results.length) return null

    const place = results[0]
    return {
      latitude: Number(place.lat),
      longitude: Number(place.lon),
      displayName: place.display_name,
    }
  } catch {
    return null
  }
}
