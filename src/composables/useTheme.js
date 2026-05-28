import { ref, watch } from 'vue'

// State global — satu instance untuk seluruh app
const isDark = ref(localStorage.getItem('theme') === 'dark')

function applyTheme(dark) {
    if (dark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

// Apply saat pertama load
applyTheme(isDark.value)

// Sync ke DOM dan localStorage setiap kali berubah
watch(isDark, (val) => {
    applyTheme(val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
})

export function useTheme() {
    function toggle() {
        isDark.value = !isDark.value
    }

    // Return isDark langsung (bukan dalam object) agar bisa destructure di template
    return { isDark, toggle }
}
