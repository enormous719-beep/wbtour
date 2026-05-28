import { ref } from 'vue'
import { apiUrl } from '../utils/api.js'

/**
 * Fetch semua paket, opsional dengan query pencarian
 */
export function usePackages() {
    const packages = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchPackages(q = '') {
        loading.value = true
        error.value = null
        try {
            const url = q ? apiUrl(`/api/packages?q=${encodeURIComponent(q)}`) : apiUrl('/api/packages')
            const res = await fetch(url)
            if (!res.ok) throw new Error('Gagal mengambil data paket')
            packages.value = await res.json()
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { packages, loading, error, fetchPackages }
}

/**
 * Fetch satu paket by slug
 */
export function usePackageDetail() {
    const pkg = ref(null)
    const loading = ref(false)
    const error = ref(null)

    async function fetchPackage(slug) {
        loading.value = true
        error.value = null
        pkg.value = null
        try {
            const res = await fetch(apiUrl(`/api/packages/${slug}`))
            if (res.status === 404) throw new Error('not_found')
            if (!res.ok) throw new Error('Gagal mengambil detail paket')
            pkg.value = await res.json()
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { pkg, loading, error, fetchPackage }
}
