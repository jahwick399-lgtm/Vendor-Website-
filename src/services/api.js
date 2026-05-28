const BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch {
    throw new Error(`Server error: ${text.slice(0, 120)}`)
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch {
    throw new Error(`Server error: ${text.slice(0, 120)}`)
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export async function createCheckoutSession(vendorId) {
  return post('/api/create-checkout-session', { vendorId })
}

export async function verifySession(sessionId) {
  return get(`/api/verify-session?session_id=${sessionId}`)
}

export async function checkHealth() {
  return get('/api/health')
}
