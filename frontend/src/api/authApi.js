import { requestJson } from './httpClient'

export async function registerAccount({ email, username, password }) {
  return requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  })
}

export async function loginAccount({ email, password }) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
