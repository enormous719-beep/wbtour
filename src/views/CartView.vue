<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

    <!-- PAGE HEADER -->
    <div class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-10 px-6">
      <div class="max-w-4xl mx-auto">
        <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-2">Keranjang</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Paket Pilihan Anda
          <span v-if="cart.items.length" class="text-lg font-normal text-gray-400 ml-2">
            ({{ cart.items.length }} paket)
          </span>
        </h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 md:px-6 py-10">

      <!-- EMPTY STATE -->
      <div v-if="!cart.items.length" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-5">
          <svg class="w-8 h-8 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Keranjang masih kosong</h2>
        <p class="text-sm text-gray-400 mb-6">Tambahkan paket wisata yang kamu suka</p>
        <RouterLink to="/packages" class="px-6 py-3 bg-gray-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors">
          Lihat Semua Paket
        </RouterLink>
      </div>

      <!-- CART ITEMS + SUMMARY -->
      <div v-else class="grid md:grid-cols-3 gap-6">

        <!-- ITEMS LIST -->
        <div class="md:col-span-2 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:border-gray-200 dark:hover:border-slate-600 transition-colors"
          >
            <!-- Card utama -->
            <div class="flex">
              <!-- Image -->
              <div class="w-28 md:w-36 flex-shrink-0">
                <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
              </div>

              <!-- Info -->
              <div class="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <RouterLink
                    :to="'/packages/' + item.slug"
                    class="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-2 block"
                  >
                    {{ item.title }}
                  </RouterLink>
                  <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ item.city }} • {{ item.days }}H {{ item.nights }}M
                  </p>
                </div>

                <div class="flex items-center justify-between mt-3">
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatIDR(item.price) }}</div>
                  <div class="flex items-center gap-2">
                    <!-- Toggle itinerary -->
                    <button
                      @click="toggleItinerary(item)"
                      class="text-xs font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                    >
                      <svg
                        class="w-3 h-3 transition-transform duration-200"
                        :class="expandedId === item.id ? 'rotate-180' : ''"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                      Itinerary
                    </button>
                    <span class="text-gray-200 dark:text-slate-600">|</span>
                    <a :href="getWhatsAppLink(item)" target="_blank" class="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                      Pesan via WA
                    </a>
                    <span class="text-gray-200 dark:text-slate-600">|</span>
                    <button @click="cart.removeItem(item.id)" class="text-xs text-gray-400 hover:text-red-500 transition-colors">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ITINERARY ACCORDION -->
            <transition name="accordion">
              <div v-if="expandedId === item.id" class="border-t border-gray-100 dark:border-slate-700 px-5 py-4">

                <!-- Loading -->
                <div v-if="itineraryLoading" class="space-y-2">
                  <div v-for="n in 3" :key="n" class="h-3 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" :style="{ width: (60 + n * 10) + '%' }"></div>
                </div>

                <!-- Tidak ada itinerary -->
                <p v-else-if="!itineraryData.length" class="text-xs text-gray-400 text-center py-2">
                  Itinerary belum tersedia untuk paket ini.
                </p>

                <!-- Itinerary list -->
                <div v-else class="space-y-4">
                  <div v-for="(day, di) in itineraryData" :key="di" class="flex gap-3">
                    <!-- Day badge -->
                    <div class="flex flex-col items-center">
                      <div class="w-6 h-6 rounded-full bg-gray-900 dark:bg-slate-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {{ di + 1 }}
                      </div>
                      <div v-if="di < itineraryData.length - 1" class="w-px flex-1 bg-gray-100 dark:bg-slate-700 mt-1"></div>
                    </div>
                    <!-- Kegiatan -->
                    <div class="pb-3 flex-1">
                      <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hari {{ di + 1 }}</div>
                      <ul class="space-y-1">
                        <li v-for="(act, ai) in day" :key="ai" class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                          <span class="text-gray-300 dark:text-slate-600 mt-0.5">•</span>{{ act }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </transition>
          </div>

          <!-- Clear all -->
          <button @click="confirmClear" class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 mt-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Kosongkan keranjang
          </button>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="md:col-span-1">
          <div class="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-5">Ringkasan Pesanan</h2>

            <div class="space-y-3 mb-5">
              <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400 truncate mr-2 max-w-[140px]">{{ item.title }}</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium flex-shrink-0">{{ formatIDR(item.price) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-100 dark:border-slate-700 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                <span class="text-base font-bold text-gray-900 dark:text-white">{{ formatIDR(cart.totalPrice) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ cart.items.length }} paket wisata</p>
            </div>

            <button @click="orderAll" class="block w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold text-center rounded-xl transition-colors mb-3">
              Pesan Semua via WhatsApp
            </button>

            <RouterLink to="/packages" class="block w-full py-3 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-600 dark:text-gray-400 text-sm font-medium text-center rounded-xl transition-colors">
              Tambah Paket Lain
            </RouterLink>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/keranjang'
import { getWhatsAppLink, orderViaWhatsApp } from '../utils/wa'
import { formatIDR } from '../data/packages'

const cart = useCartStore()

// Itinerary accordion
const expandedId = ref(null)
const itineraryData = ref([])
const itineraryLoading = ref(false)

async function toggleItinerary(item) {
  // Tutup kalau sudah terbuka
  if (expandedId.value === item.id) {
    expandedId.value = null
    return
  }

  expandedId.value = item.id
  itineraryData.value = []
  itineraryLoading.value = true

  try {
    const res = await fetch(`/api/packages/${item.slug}`)
    if (res.ok) {
      const pkg = await res.json()
      itineraryData.value = pkg.itinerary || []
    }
  } catch {
    itineraryData.value = []
  } finally {
    itineraryLoading.value = false
  }
}

function confirmClear() {
  if (confirm('Kosongkan semua paket dari keranjang?')) {
    cart.clearCart()
  }
}

function orderAll() {
  orderViaWhatsApp({ items: cart.items })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
