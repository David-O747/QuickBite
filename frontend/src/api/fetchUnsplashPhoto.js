// free food photos from unsplash — needs VITE_UNSPLASH_ACCESS_KEY
export async function fetchUniqueUnsplashPhoto(searchWord, usedPhotoUrls) {
  const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  if (!unsplashKey) return null

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchWord)}&per_page=20&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${unsplashKey}` } }
    )

    if (!response.ok) return null

    const photoData = await response.json()

    for (const photo of photoData.results || []) {
      const photoUrl = photo.urls?.regular
      if (photoUrl && !usedPhotoUrls.has(photoUrl)) {
        usedPhotoUrls.add(photoUrl)
        return photoUrl
      }
    }
  } catch {
    return null
  }

  return null
}
