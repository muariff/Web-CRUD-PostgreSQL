const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message || `Gagal (${res.status})`
    throw new Error(msg)
  }
  return data
}

export const assetApi = {
  list: () => request('/assets'),
  create: (p) => request('/assets', { method: 'POST', body: JSON.stringify(p) }),
  update: (id, p) => request(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  remove: (id) => request(`/assets/${id}`, { method: 'DELETE' }),
}