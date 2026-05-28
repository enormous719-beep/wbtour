<template>
  <!-- LOADING STATE -->
  <div v-if="loading" class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
    <div class="w-full h-64 md:h-[420px] bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
    <div class="max-w-5xl mx-auto px-4 md:px-6 mt-8 grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-3 animate-pulse">
          <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/3"></div>
          <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-2/3"></div>
          <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 h-64 animate-pulse"></div>
    </div>
  </div>

  <!-- PAKET TIDAK DITEMUKAN / ERROR -->
  <div v-else-if="error || !pkg" class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 dark:bg-slate-900">
    <div class="text-5xl mb-4">😕</div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Paket Tidak Ditemukan</h1>
    <p class="text-gray-400 text-sm mb-6">Paket yang kamu cari tidak tersedia atau sudah tidak aktif.</p>
    <RouterLink
      to="/packages"
      class="px-5 py-2.5 bg-gray-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors"
    >
      ← Lihat Semua Paket
    </RouterLink>
  </div>

  <!-- DETAIL PAKET -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 transition-colors duration-300">

    <!-- HERO -->
    <section class="relative w-full h-64 md:h-[420px] overflow-hidden">
      <img
        :src="pkg.thumbnailLarge || pkg.thumbnail"
        :alt="pkg.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <!-- Back button -->
      <button
        @click="router.back()"
        class="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Kembali
      </button>

      <!-- Hero content -->
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div class="max-w-5xl mx-auto">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs font-medium bg-emerald-500/90 text-white px-3 py-1 rounded-full">
              {{ pkg.city }}
            </span>
            <span class="text-xs font-medium bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full">
              {{ pkg.days }} Hari {{ pkg.nights }} Malam
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-bold text-white mb-2">{{ pkg.title }}</h1>
          <p class="text-emerald-300 text-xl font-bold">{{ formatIDR(pkg.price) }}<span class="text-white/60 text-sm font-normal">/pax</span></p>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <div class="max-w-5xl mx-auto px-4 md:px-6 mt-8">
      <div class="grid md:grid-cols-3 gap-6">

        <!-- LEFT: Detail Info -->
        <div class="md:col-span-2 space-y-6">

          <!-- Highlights -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Highlight</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="h in pkg.highlights"
                :key="h"
                class="flex items-center gap-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-3 py-1.5 rounded-xl font-medium"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ h }}
              </span>
            </div>
          </div>

          <!-- Include / Exclude -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Sudah Termasuk</h2>
                <ul class="space-y-2.5">
                  <li v-for="(inc, i) in pkg.includes" :key="i" class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✓</span>
                    {{ inc }}
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Tidak Termasuk</h2>
                <ul class="space-y-2.5">
                  <li v-for="(exc, i) in pkg.excludes" :key="i" class="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                    <span class="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✕</span>
                    {{ exc }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Tabs: Itinerary / Harga -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <!-- Tab buttons -->
            <div class="flex border-b border-gray-100 dark:border-slate-700">
              <button
                @click="tab = 'itinerary'"
                :class="[
                  'flex-1 py-4 text-sm font-semibold transition-colors',
                  tab === 'itinerary'
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white -mb-px'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                ]"
              >
                Itinerary
              </button>
              <button
                @click="tab = 'harga'"
                :class="[
                  'flex-1 py-4 text-sm font-semibold transition-colors',
                  tab === 'harga'
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white -mb-px'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                ]"
              >
                Pilihan Harga
              </button>
            </div>

            <!-- Tab: Itinerary -->
            <div v-if="tab === 'itinerary'" class="p-6 space-y-4">
              <div
                v-for="(day, index) in pkg.itinerary"
                :key="index"
                class="flex gap-4"
              >
                <!-- Day indicator -->
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-gray-900 dark:bg-slate-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <div v-if="index < pkg.itinerary.length - 1" class="w-px flex-1 bg-gray-100 dark:bg-slate-700 mt-2"></div>
                </div>
                <!-- Day content -->
                <div class="pb-6 flex-1">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Hari {{ index + 1 }}</h3>
                  <ul class="space-y-1.5">
                    <li v-for="(item, i2) in day" :key="i2" class="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <span class="text-gray-300 dark:text-slate-600 mt-1">•</span>
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Tab: Harga -->
            <div v-if="tab === 'harga'" class="p-6">
              <div class="space-y-3">
                <div
                  v-for="(opt, idx) in pkg.priceOptions"
                  :key="idx"
                  class="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 transition-colors"
                >
                  <div>
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ opt.name }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">Per orang</div>
                  </div>
                  <div class="text-base font-bold text-emerald-600">{{ formatIDR(opt.price) }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT: Booking Box -->
        <div class="md:col-span-1">
          <div class="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">

            <div class="mb-5">
              <div class="text-xs text-gray-400 mb-1">Harga mulai dari</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatIDR(pkg.price) }}</div>
              <div class="text-xs text-gray-400">/pax</div>
            </div>

            <div class="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Jaminan harga terbaik
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Konfirmasi instan via WA
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Guide berpengalaman
              </div>
            </div>

            <!-- CTA Buttons -->
            <button
              @click="order"
              class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors mb-3"
            >
              Pesan via WhatsApp
            </button>

            <button
              @click="addToCart"
              class="w-full py-3.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Tambah ke Keranjang
            </button>

            <!-- Added to cart feedback -->
            <p v-if="addedMsg" class="text-center text-xs text-emerald-600 mt-3 font-medium">
              ✓ Ditambahkan ke keranjang!
            </p>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePackageDetail } from '@/composables/usePackages'
import { useCartStore } from '@/stores/keranjang'
import { getWhatsAppLink, orderViaWhatsApp } from '@/utils/wa'
import { formatIDR } from '@/data/packages'

const route = useRoute()
const router = useRouter()
const { pkg, loading, error, fetchPackage } = usePackageDetail()

const cart = useCartStore()
const tab = ref('itinerary')
const addedMsg = ref(false)

onMounted(() => fetchPackage(route.params.slug))

function addToCart() {
  cart.addToCart(pkg.value)
  addedMsg.value = true
  setTimeout(() => { addedMsg.value = false }, 2000)
}

function order() {
  orderViaWhatsApp({
    items: [{
      title: pkg.value.title,
      price: pkg.value.price,
      quantity: 1,
      thumbnail: pkg.value.thumbnailLarge || pkg.value.thumbnail
    }]
  })
}
</script>
