<template>
  <div class="p-8 max-w-5xl">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-xl font-bold text-white tracking-tight">Dashboard</h1>
      <p class="text-zinc-500 text-sm mt-1">Ringkasan aktivitas Wahyu Bandung Tour</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      <template v-if="stats">
        <div v-for="card in statCards" :key="card.label"
          class="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <span class="text-xs font-medium text-zinc-500">{{ card.label }}</span>
            <span class="text-base">{{ card.icon }}</span>
          </div>
          <div class="text-2xl font-bold tracking-tight" :class="card.color">{{ card.value }}</div>
          <div v-if="card.sub" class="text-[11px] text-zinc-600 mt-1">{{ card.sub }}</div>
        </div>
      </template>
      <template v-else>
        <div v-for="n in 4" :key="n" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-28"></div>
      </template>
    </div>

    <!-- Recent Orders -->
    <div class="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-zinc-800/60 flex items-center justify-between">
        <span class="text-sm font-semibold text-white">Pesanan Terbaru</span>
        <RouterLink to="/admin/orders" class="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
          Lihat semua →
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="loadingOrders" class="p-6 space-y-3">
        <div v-for="n in 3" :key="n" class="h-10 bg-zinc-800 rounded-xl animate-pulse"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!recentOrders.length" class="py-16 text-center">
        <div class="text-3xl mb-3 opacity-30">📋</div>
        <p class="text-zinc-600 text-sm">Belum ada pesanan masuk</p>
      </div>

      <!-- Table -->
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-800/60">
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">#</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Pelanggan</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Paket</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Total</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/40">
          <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-zinc-800/20 transition-colors">
            <td class="px-6 py-4 text-zinc-600 text-xs">#{{ order.id }}</td>
            <td class="px-6 py-4 text-zinc-200 font-medium">{{ order.customerName }}</td>
            <td class="px-6 py-4 text-zinc-400 text-xs">{{ order.items.map(i => i.title).join(', ') }}</td>
            <td class="px-6 py-4 text-emerald-400 font-semibold text-xs">{{ formatIDR(order.totalPrice) }}</td>
            <td class="px-6 py-4">
              <span :class="statusClass(order.status)" class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium">
                {{ statusLabel(order.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { formatIDR } from '@/data/packages'

const admin = useAdminStore()
const stats = ref(null)
const recentOrders = ref([])
const loadingOrders = ref(true)

onMounted(async () => {
  const headers = admin.authHeaders()
  const [sRes, oRes] = await Promise.all([
    fetch('/api/admin/stats', { headers }),
    fetch('/api/orders', { headers }),
  ])
  stats.value = await sRes.json()
  recentOrders.value = (await oRes.json()).slice(0, 5)
  loadingOrders.value = false
})

const statCards = computed(() => stats.value ? [
  { label: 'Total Paket', icon: '🗺', value: stats.value.totalPackages, color: 'text-white' },
  { label: 'Total Pesanan', icon: '📋', value: stats.value.totalOrders, color: 'text-white' },
  { label: 'Menunggu', icon: '⏳', value: stats.value.pendingOrders, color: 'text-yellow-400' },
  { label: 'Pendapatan', icon: '💰', value: formatIDR(stats.value.totalRevenue), color: 'text-emerald-400', sub: 'dari pesanan confirmed' },
] : [])

function statusLabel(s) {
  return { pending: 'Menunggu', confirmed: 'Confirmed', cancelled: 'Dibatalkan' }[s] || s
}
function statusClass(s) {
  return {
    pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/10',
  }[s]
}
</script>
