import { requestJson } from './httpClient'

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
