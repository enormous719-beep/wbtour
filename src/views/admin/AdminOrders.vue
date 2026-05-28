<template>
  <div class="p-8 max-w-5xl">

    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">Pesanan</h1>
        <p class="text-zinc-500 text-sm mt-1">Riwayat pesanan yang masuk via website</p>
      </div>
      <!-- Filter -->
      <div class="flex gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        <button
          v-for="f in filters" :key="f.value"
          @click="activeFilter = f.value"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            activeFilter === f.value ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
          ]"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!filteredOrders.length" class="bg-zinc-900 border border-zinc-800 rounded-2xl py-20 text-center">
      <div class="text-4xl mb-3 opacity-20">📋</div>
      <p class="text-zinc-600 text-sm">Tidak ada pesanan{{ activeFilter !== 'all' ? ` dengan status ini` : '' }}</p>
    </div>

    <!-- Orders -->
    <div v-else class="space-y-3">
      <div
        v-for="order in filteredOrders" :key="order.id"
        class="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
      >
        <div class="flex items-start gap-4">
          <!-- Left -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2.5 mb-2.5">
              <span class="text-zinc-600 text-xs font-mono">#{{ order.id }}</span>
              <span :class="statusClass(order.status)" class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border">
                {{ statusLabel(order.status) }}
              </span>
              <span class="text-zinc-700 text-xs">{{ formatDate(order.createdAt) }}</span>
            </div>

            <div class="text-white font-semibold text-sm mb-0.5">{{ order.customerName }}</div>
            <div class="text-zinc-600 text-xs mb-3">{{ order.customerPhone }}</div>

            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="item in order.items" :key="item.title"
                class="text-[11px] bg-zinc-800 text-zinc-400 border border-zinc-700/50 px-2.5 py-1 rounded-lg"
              >
                {{ item.title }} · {{ formatIDR(item.price) }}
              </span>
            </div>

            <div v-if="order.note" class="mt-2.5 text-xs text-zinc-600 italic">
              "{{ order.note }}"
            </div>
          </div>

          <!-- Right -->
          <div class="flex flex-col items-end gap-3 flex-shrink-0">
            <div class="text-emerald-400 font-bold">{{ formatIDR(order.totalPrice) }}</div>
            <div class="flex gap-1.5">
              <button
                v-if="order.status === 'pending'"
                @click="updateStatus(order, 'confirmed')"
                class="px-3 py-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10 rounded-lg transition-colors"
              >
                ✓ Konfirmasi
              </button>
              <button
                v-if="order.status === 'pending'"
                @click="updateStatus(order, 'cancelled')"
                class="px-3 py-1.5 text-[11px] font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 rounded-lg transition-colors"
              >
                ✕ Batalkan
              </button>
              <button
                v-if="order.status !== 'pending'"
                @click="updateStatus(order, 'pending')"
                class="px-3 py-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 bg-zinc-800 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                @click="deleteOrder(order)"
                class="px-3 py-1.5 text-[11px] font-medium text-zinc-600 hover:text-red-400 bg-zinc-800 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { formatIDR } from '@/data/packages'

const admin = useAdminStore()
const orders = ref([])
const loading = ref(true)
const activeFilter = ref('all')

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

const filteredOrders = computed(() =>
  activeFilter.value === 'all' ? orders.value : orders.value.filter(o => o.status === activeFilter.value)
)

onMounted(fetchOrders)

async function fetchOrders() {
  loading.value = true
  const res = await fetch('/api/orders', { headers: admin.authHeaders() })
  orders.value = await res.json()
  loading.value = false
}

async function updateStatus(order, status) {
  const res = await fetch(`/api/orders/${order.id}/status`, {
    method: 'PATCH', headers: admin.authHeaders(), body: JSON.stringify({ status }),
  })
  const updated = await res.json()
  const idx = orders.value.findIndex(o => o.id === order.id)
  if (idx !== -1) orders.value[idx] = updated
}

async function deleteOrder(order) {
  if (!confirm(`Hapus pesanan #${order.id}?`)) return
  await fetch(`/api/orders/${order.id}`, { method: 'DELETE', headers: admin.authHeaders() })
  orders.value = orders.value.filter(o => o.id !== order.id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function statusLabel(s) {
  return { pending: 'Menunggu', confirmed: 'Confirmed', cancelled: 'Dibatalkan' }[s] || s
}
function statusClass(s) {
  return {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/10',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/10',
  }[s]
}
</script>
