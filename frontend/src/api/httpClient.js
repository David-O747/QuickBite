const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000'

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }
  return data
}
