const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000'

async function requestJson(path, options = {}) {
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

export async function createOrder(payload) {
  return requestJson('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getOrderByTrackingId(trackingPublicId) {
  return requestJson(`/api/orders/${encodeURIComponent(trackingPublicId)}`)
}

export async function createOrderHelpRequest(trackingPublicId, payload) {
  return requestJson(`/api/orders/${encodeURIComponent(trackingPublicId)}/help`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
