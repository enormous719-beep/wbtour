<template>
  <!-- Admin punya layout sendiri, tidak pakai navbar/footer publik -->
  <RouterView v-if="isAdminRoute" />

  <div v-else class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

   <header class="fixed top-0 left-0 w-full z-[999] flex justify-center px-4 pt-4 pointer-events-none">
  <div
    class="pointer-events-auto w-full max-w-4xl transition-all duration-300 rounded-2xl"
    :class="scrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border border-gray-200/80 dark:bg-slate-900/95 dark:border-slate-700/80'
      : isHomePage
        ? 'bg-white/10 backdrop-blur-md border border-white/20'
        : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border border-gray-200/80 dark:bg-slate-900/95 dark:border-slate-700/80'"
  >
  <div class="px-5 h-14 flex items-center justify-between">

    <!-- LOGO -->
    <RouterLink to="/" class="flex items-center flex-shrink-0">
      <img :src="logo" alt="Logo WBT" class="h-14 w-auto object-contain transition-all duration-300"
        :class="(!scrolled && isHomePage) ? 'brightness-0 invert' : ''"
      />
    </RouterLink>

    <!-- DESKTOP MENU -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium transition-colors duration-300"
      :class="(!scrolled && isHomePage) ? 'text-white/90' : 'text-gray-500 dark:text-gray-300'"
    >
      <a @click.prevent="goSection('home')"
        class="cursor-pointer transition-colors hover:opacity-100"
        :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
      >Home</a>
      <RouterLink to="/packages"
        class="transition-colors"
        :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
      >Paket</RouterLink>

      <!-- Destinasi Dropdown -->
      <div class="relative" @mouseenter="destOpen = true" @mouseleave="destOpen = false">
        <button
          class="flex items-center gap-1 transition-colors"
          :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
        >
          Destinasi
          <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="destOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown panel -->
        <transition name="dropdown">
          <div v-if="destOpen"
            class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 rounded-2xl shadow-xl border overflow-hidden z-50"
            :class="(!scrolled && isHomePage)
              ? 'bg-black/40 backdrop-blur-xl border-white/10'
              : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'"
          >
            <div class="py-1.5">
              <button
                v-for="dest in destinations" :key="dest.city"
                @click="goDestination(dest.city); destOpen = false"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                :class="(!scrolled && isHomePage)
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'"
              >
                <span class="text-base">{{ dest.icon }}</span>
                <div>
                  <div class="font-medium" :class="(!scrolled && isHomePage) ? 'text-white' : 'text-gray-800 dark:text-gray-200'">{{ dest.city }}</div>
                  <div class="text-[11px]" :class="(!scrolled && isHomePage) ? 'text-white/50' : 'text-gray-400'">{{ dest.desc }}</div>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <RouterLink to="/blog"
        class="transition-colors"
        :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
      >Blog</RouterLink>
      <a @click.prevent="goSection('about')"
        class="cursor-pointer transition-colors"
        :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
      >Tentang Kami</a>
      <a @click.prevent="goSection('contact')"
        class="cursor-pointer transition-colors"
        :class="(!scrolled && isHomePage) ? 'hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'"
      >Kontak</a>
    </nav>

    <!-- RIGHT ACTIONS -->
    <div class="hidden md:flex items-center gap-2">
      <!-- Theme Toggle -->
      <button
        @click="toggle()"
        class="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
        :class="(!scrolled && isHomePage)
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <!-- Sun icon (shown in dark mode) -->
        <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      </button>

      <button
        @click="router.push('/cart')"
        class="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all"
        :class="(!scrolled && isHomePage)
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ cartCount }}</span>
      </button>
    </div>

    <!-- MOBILE BUTTON -->
    <div class="md:hidden flex items-center gap-2">
      <!-- Theme Toggle Mobile -->
      <button
        @click="toggle()"
        class="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
      >
        <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      </button>

      <button @click="router.push('/cart')" class="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span v-if="cartCount > 0" class="absolute top-0.5 right-0.5 bg-emerald-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">{{ cartCount }}</span>
      </button>
      <button @click="mobileOpen = !mobileOpen"
        class="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'"
      >
        <svg v-if="!mobileOpen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- MOBILE MENU DROPDOWN -->
  <transition name="slide-down">
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100/50 px-5 py-4 space-y-3"
      :class="(!scrolled && isHomePage) ? 'border-white/10' : 'border-gray-100 dark:border-slate-700'"
    >
      <a @click.prevent="goSection('home'); mobileOpen=false"
        class="block text-sm font-medium cursor-pointer transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >Home</a>
      <RouterLink to="/packages" @click="mobileOpen=false"
        class="block text-sm font-medium transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >Paket</RouterLink>

      <!-- Destinasi mobile -->
      <div>
        <button
          @click="destMobileOpen = !destMobileOpen"
          class="flex items-center gap-1 text-sm font-medium transition-colors w-full"
          :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
        >
          Destinasi
          <svg class="w-3.5 h-3.5 transition-transform duration-200 ml-1" :class="destMobileOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div v-if="destMobileOpen" class="mt-2 ml-3 space-y-2">
          <button
            v-for="dest in destinations" :key="dest.city"
            @click="goDestination(dest.city); mobileOpen = false; destMobileOpen = false"
            class="flex items-center gap-2 text-sm transition-colors w-full"
            :class="(!scrolled && isHomePage) ? 'text-white/70 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
          >
            <span>{{ dest.icon }}</span> {{ dest.city }}
          </button>
        </div>
      </div>

      <RouterLink to="/blog" @click="mobileOpen=false"
        class="block text-sm font-medium transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >Blog</RouterLink>
      <a @click.prevent="goSection('about'); mobileOpen=false"
        class="block text-sm font-medium cursor-pointer transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >Tentang Kami</a>
      <a @click.prevent="goSection('contact'); mobileOpen=false"
        class="block text-sm font-medium cursor-pointer transition-colors"
        :class="(!scrolled && isHomePage) ? 'text-white/80 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >Kontak</a>
    </div>
  </transition>

  </div>
</header>


    <!-- HALAMAN ROUTER -->
    <main
      class="flex-1"
      :class="route.path === '/' ? 'pt-0' : 'pt-24 mx-auto max-w-6xl px-4 py-6'"
    >
      <RouterView @added="showToast" />
    </main>

    <!-- FOOTER -->
    <footer class="bg-gray-950 text-gray-400" id="contact">
      <div class="max-w-6xl mx-auto px-6 pt-14 pb-8">

        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <!-- Brand -->
          <div class="md:col-span-2">
            <img :src="logo" alt="Logo WBT" class="h-10 mb-4 brightness-0 invert opacity-80" />
            <p class="text-sm leading-relaxed text-gray-500 max-w-xs">
              Wahyu Bandung Tour – Teman perjalanan terbaik Anda untuk menjelajahi Indonesia dan dunia.
            </p>
            <a :href="waFooter" target="_blank"
               class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat via WhatsApp
            </a>
          </div>

          <!-- Navigasi -->
          <div>
            <h3 class="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Navigasi</h3>
            <ul class="space-y-3 text-sm">
              <li><a @click.prevent="goSection('home')" class="hover:text-white cursor-pointer transition-colors">Home</a></li>
              <li><RouterLink to="/packages" class="hover:text-white transition-colors">Paket Wisata</RouterLink></li>
              <li><RouterLink to="/blog" class="hover:text-white transition-colors">Blog</RouterLink></li>
              <li><RouterLink to="/cart" class="hover:text-white transition-colors">Keranjang</RouterLink></li>
              <li><a @click.prevent="goSection('about')" class="hover:text-white cursor-pointer transition-colors">Tentang Kami</a></li>
            </ul>
          </div>

          <!-- Kontak -->
          <div>
            <h3 class="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Kontak</h3>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-2">
                <span class="text-gray-600 mt-0.5">✉</span>
                wb.tour@gmail.com
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                0822-2722-7039
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {{ new Date().getFullYear() }} Wahyu Bandung Tour. All rights reserved.</span>
          <span>Made with ♥ in Bandung</span>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from './stores/keranjang.js'
import { useTheme } from './composables/useTheme.js'
import logo from './assets/wbtour.png'

const { isDark, toggle } = useTheme()

const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)
const destOpen = ref(false)
const destMobileOpen = ref(false)

const destinations = [
  { city: 'Bandung', icon: '🌿', desc: 'Kota kembang & alam sejuk' },
  { city: 'Yogyakarta', icon: '🏛️', desc: 'Budaya & candi bersejarah' },
  { city: 'Malang', icon: '🍎', desc: 'Kota apel & wisata alam' },
]

function goDestination(city) {
  router.push({ name: 'packages', query: { q: city } })
}

// Sembunyikan navbar/footer di halaman admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Deteksi halaman home
const isHomePage = computed(() => route.path === '/')

// Deteksi scroll
const scrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })
})

// Fungsi scroll halaman
function goSection(id) {
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

// Keranjang
const cart = useCartStore()
const cartCount = computed(() => cart.items.length)

// WA Footer
const waFooter = `https://wa.me/6282227227039?text=${encodeURIComponent(
  'Halo, saya ingin tanya paket di Wahyu Bandung Tour.'
)}`

// Toast
const toastVisible = ref(false)
function showToast() {
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 1500)
}
</script>

<style>
body {
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.dark body {
  background: #0f172a;
  color: #e2e8f0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
