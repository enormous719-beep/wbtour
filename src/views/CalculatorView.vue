<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {{ t('calculator.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('calculator.description') }}
        </p>
      </div>

      <!-- Calculator Component -->
      <PriceCalculator />

      <!-- Info Section -->
      <div class="mt-10 grid md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentLang === 'id' ? 'Harga Transparan' : 'Transparent Pricing' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLang === 'id' 
              ? 'Estimasi harga yang jelas tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar.' 
              : 'Clear price estimates with no hidden fees. What you see is what you pay.' }}
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentLang === 'id' ? 'Proses Cepat' : 'Fast Process' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLang === 'id' 
              ? 'Dapatkan estimasi harga dalam hitungan detik dan langsung konsultasi via WhatsApp.' 
              : 'Get price estimates in seconds and consult directly via WhatsApp.' }}
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentLang === 'id' ? 'Dapat Disesuaikan' : 'Customizable' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLang === 'id' 
              ? 'Sesuaikan paket dengan jumlah peserta, durasi, dan kategori hotel sesuai budget Anda.' 
              : 'Customize packages with number of participants, duration, and hotel category according to your budget.' }}
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentLang === 'id' ? 'Dukungan 24/7' : '24/7 Support' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLang === 'id' 
              ? 'Tim kami siap membantu Anda kapan saja untuk konsultasi dan booking.' 
              : 'Our team is ready to help you anytime for consultation and booking.' }}
          </p>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-10 text-center">
        <button
          @click="$router.push('/packages')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          {{ currentLang === 'id' ? 'Lihat Semua Paket' : 'View All Packages' }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PriceCalculator from '../components/PriceCalculator.vue'
import { useLanguage } from '../composables/useLanguage'

const { t, currentLang } = useLanguage()
</script>
