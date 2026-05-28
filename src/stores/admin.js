import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
    const token = ref(localStorage.getItem('admin_token') || null)
    const isLoggedIn = ref(!!token.value)

    async function login(password) {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        if (!res.ok) throw new Error('Password salah')
        const data = await res.json()
        token.value = data.token
        isLoggedIn.value = true
        localStorage.setItem('admin_token', data.token)
    }

    function logout() {
        token.value = null
        isLoggedIn.value = false
        localStorage.removeItem('admin_token')
    }

    function authHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
        }
    }

    return { token, isLoggedIn, login, logout, authHeaders }
})
