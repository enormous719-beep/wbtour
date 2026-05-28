<template>
  <div class="min-h-screen bg-[#0f0f0f] flex">

    <!-- SIDEBAR -->
    <aside class="w-60 flex-shrink-0 flex flex-col border-r border-zinc-800/60">

      <!-- Brand -->
      <div class="px-5 h-16 flex items-center gap-3 border-b border-zinc-800/60">
        <div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
          </svg>
        </div>
        <div>
          <div class="text-white text-sm font-semibold leading-none">WBTour</div>
          <div class="text-zinc-600 text-[10px] mt-0.5">Admin Panel</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-0.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
          :class="$route.name === item.name
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'"
        >
          <span class="text-base leading-none" :class="$route.name === item.name ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'">
            {{ item.icon }}
          </span>
          <span class="font-medium">{{ item.label }}</span>

          <!-- Active dot -->
          <span v-if="$route.name === item.name" class="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="px-3 py-4 border-t border-zinc-800/60 space-y-0.5">
        <!-- Link ke website -->
        <a
          href="/"
          target="_blank"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
        >
          <span class="opacity-50">🌐</span>
          <span class="font-medium">Lihat Website</span>
          <svg class="w-3 h-3 ml-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <span class="opacity-50">↩</span>
          <span class="font-medium">Keluar</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="h-16 border-b border-zinc-800/60 flex items-center px-8 flex-shrink-0">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-zinc-600">Admin</span>
          <span class="text-zinc-700">/</span>
          <span class="text-zinc-300 font-medium">{{ currentPageLabel }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const route = useRoute()
const admin = useAdminStore()

const navItems = [
  { to: '/admin/panel/dashboard', name: 'admin-dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/admin/panel/packages', name: 'admin-packages', icon: '🗺', label: 'Paket Wisata' },
  { to: '/admin/panel/orders', name: 'admin-orders', icon: '📋', label: 'Pesanan' },
  { to: '/admin/panel/blog', name: 'admin-blog', icon: '✏️', label: 'Blog' },
]

const currentPageLabel = computed(() =>
  navItems.find(i => i.name === route.name)?.label || ''
)

function handleLogout() {
  admin.logout()
  router.push({ name: 'admin-login' })
}
</script>
