<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

    <!-- PAGE HEADER -->
    <div class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-10 px-6 transition-colors duration-300">
      <div class="max-w-6xl mx-auto">
        <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-2">Temukan Perjalananmu</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Semua Paket Wisata</h1>

        <!-- Search Bar -->
        <div class="flex w-full max-w-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari paket atau destinasi..."
            class="flex-1 px-4 py-3 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          />
          <div class="px-4 flex items-center text-gray-400 dark:text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- PACKAGES GRID -->
    <div class="max-w-6xl mx-auto px-6 py-10">

      <!-- Loading state -->
      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-100 dark:bg-slate-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2"></div>
            <div class="h-3 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-4xl mb-4">⚠️</div>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Gagal memuat paket: <strong>{{ error }}</strong></p>
        <button @click="fetchPackages(searchQuery)" class="text-sm text-emerald-600 hover:text-emerald-500">Coba lagi</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="text-center py-20">
        <div class="text-4xl mb-4">🔍</div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Tidak ada paket yang cocok dengan pencarian "<strong>{{ searchQuery }}</strong>"</p>
        <button @click="searchQuery = ''" class="mt-4 text-sm text-emerald-600 hover:text-emerald-500">Reset pencarian</button>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="pkg in filtered"
          :key="pkg.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300"
        >
          <!-- Image -->
          <div class="relative overflow-hidden h-48 cursor-pointer" @click="goDetail(pkg)">
            <img
              :src="pkg.thumbnail"
              :alt="pkg.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <!-- Duration badge -->
            <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              {{ pkg.days }}H {{ pkg.nights }}M
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h2
                class="font-semibold text-gray-900 dark:text-white text-base leading-snug cursor-pointer hover:text-emerald-600 transition-colors"
                @click="goDetail(pkg)"
              >
                {{ pkg.title }}
              </h2>
            </div>

            <p class="text-xs text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ pkg.city }}
            </p>

            <!-- Highlights -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="h in pkg.highlights.slice(0, 3)"
                :key="h"
                class="text-[11px] bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg"
              >
                {{ h }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700">
              <div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Mulai dari</div>
                <div class="text-base font-bold text-gray-900 dark:text-white">{{ formatIDR(pkg.price) }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleAdd(pkg)"
                  class="p-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  title="Tambah ke keranjang"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </button>
                <button
                  @click="goDetail(pkg)"
                  class="px-4 py-2 bg-gray-900 dark:bg-slate-600 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-slate-500 transition-colors"
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePackages } from '../composables/usePackages.js'
import { formatIDR } from '../data/packages.js'
import { useCartStore } from '../stores/keranjang.js'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()

const { packages: filtered, loading, error, fetchPackages } = usePackages()

// Ambil query dari URL jika ada (dari search di home)
const searchQuery = ref(route.query.q || '')

// Fetch saat pertama load
onMounted(() => fetchPackages(searchQuery.value))

// Sync searchQuery kalau URL query berubah dari luar (misal klik menu Paket atau Destinasi)
watch(() => route.query.q, (val) => {
  searchQuery.value = val || ''
  fetchPackages(val || '')
})

// Re-fetch saat search berubah (debounce 300ms)
let debounceTimer = null
watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchPackages(val), 300)
})

function goDetail(pkg) {
  router.push({ name: 'package-detail', params: { slug: pkg.slug } })
}

function handleAdd(pkg) {
  cart.addToCart(pkg)
}
</script>
