import { requestJson } from './httpClient'

export function fetchCustomerProfile(customerId) {
  return requestJson(`/api/customers/${encodeURIComponent(customerId)}/profile`)
}

export function updateCustomerProfile(customerId, payload) {
  return requestJson(`/api/customers/${encodeURIComponent(customerId)}/profile`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function fetchCustomerOrders(customerId) {
  return requestJson(`/api/customers/${encodeURIComponent(customerId)}/orders`)
}

export function submitSupportMessage(payload) {
  return requestJson('/api/support/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
