// Base URL backend
// Di development: pakai proxy Vite (/api → localhost:3000)
// Di production: pakai URL Railway langsung
const BASE_URL = import.meta.env.VITE_API_URL || ''

export function apiUrl(path) {
    return `${BASE_URL}${path}`
}
