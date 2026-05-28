<template>
  <div class="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">

    <!-- Background subtle grid -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

    <div class="relative w-full max-w-sm">
      <!-- Glow -->
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div class="relative">
        <!-- Brand -->
        <div class="mb-10 text-center">
          <div class="inline-flex items-center gap-2 mb-6">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
              </svg>
            </div>
            <span class="text-white font-semibold tracking-tight">WBTour</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Selamat datang</h1>
          <p class="text-zinc-500 text-sm mt-1.5">Masuk ke panel admin</p>
        </div>

        <!-- Card -->
        <div class="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-7">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-2">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                autofocus
                :disabled="loading"
                class="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div v-if="errorMsg" class="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button
              type="submit"
              :disabled="loading || !password"
              class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ loading ? 'Masuk...' : 'Masuk' }}
            </button>
          </form>
        </div>

        <p class="text-center text-zinc-700 text-xs mt-6">Akses terbatas · Wahyu Bandung Tour</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const admin = useAdminStore()
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await admin.login(password.value)
    router.push({ name: 'admin-dashboard' })
  } catch (e) {
    errorMsg.value = e.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>
