<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
    <div class="mb-6">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('calculator.title') }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('calculator.description') }}</p>
    </div>

    <div class="space-y-4">
      <!-- Destination -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('calculator.destination') }}
        </label>
        <select 
          v-model="selectedPackage" 
          class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
          <option value="">{{ t('calculator.destinationPlaceholder') }}</option>
          <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
            {{ pkg.title }} - {{ pkg.city }}
          </option>
        </select>
      </div>

      <!-- Number of participants -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('calculator.participants') }}
        </label>
        <input 
          v-model.number="pax" 
          type="number" 
          min="1" 
          :placeholder="t('calculator.participantsPlaceholder')"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <!-- Days -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('calculator.days') }}
        </label>
        <input 
          v-model.number="days" 
          type="number" 
          min="1" 
          :placeholder="t('calculator.daysPlaceholder')"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <!-- Hotel category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('calculator.hotel') }}
        </label>
        <div class="space-y-2">
          <label 
            v-for="option in hotelOptions" 
            :key="option.value"
            class="flex items-center p-3 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
            :class="{ 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500': hotelCategory === option.value }"
          >
            <input 
              v-model="hotelCategory" 
              type="radio" 
              :value="option.value"
              class="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
            />
            <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {{ option.label }} 
              <span class="text-xs text-gray-500 dark:text-gray-400">(+{{ option.multiplier }}x)</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Calculate button -->
      <button
        @click="calculate"
        :disabled="!canCalculate"
        class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
      >
        {{ t('calculator.calculate') }}
      </button>

      <!-- Result -->
      <div v-if="result" class="mt-6 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {{ t('calculator.result') }}
          </span>
          <div class="text-right">
            <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Rp {{ formatNumber(result.pricePerPerson) }}
            </div>
            <div class="text-xs text-emerald-600 dark:text-emerald-500">
              {{ t('calculator.perPerson') }}
            </div>
          </div>
        </div>
        
        <div class="pt-3 border-t border-emerald-200 dark:border-emerald-800">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('calculator.totalPrice') }} ({{ result.pax }} {{ t('calculator.participants').toLowerCase() }})
            </span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              Rp {{ formatNumber(result.total) }}
            </span>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400 mb-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <strong>{{ t('calculator.note') }}:</strong> {{ t('calculator.noteText') }}
          </div>

          <a
            :href="whatsappLink"
            target="_blank"
            class="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {{ t('calculator.consultation') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const packages = ref([])
const selectedPackage = ref('')
const pax = ref(null)
const days = ref(null)
const hotelCategory = ref('standard')
const result = ref(null)

const hotelOptions = computed(() => [
  { value: 'budget', label: t('calculator.budget'), multiplier: 0.85 },
  { value: 'standard', label: t('calculator.standard'), multiplier: 1 },
  { value: 'premium', label: t('calculator.premium'), multiplier: 1.35 }
])

const canCalculate = computed(() => {
  return selectedPackage.value && pax.value > 0 && days.value > 0
})

const whatsappLink = computed(() => {
  if (!result.value) return '#'
  
  const pkg = packages.value.find(p => p.id === selectedPackage.value)
  const message = t('calculator.whatsappMessage')
    .replace('{package}', pkg?.title || '')
    .replace('{pax}', pax.value)
  
  return `https://wa.me/6282227227039?text=${encodeURIComponent(message)}`
})

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/packages`)
    packages.value = await res.json()
  } catch (error) {
    console.error('Failed to load packages:', error)
  }
})

function calculate() {
  if (!canCalculate.value) return

  const pkg = packages.value.find(p => p.id === selectedPackage.value)
  if (!pkg) return

  // Base price calculation
  let basePrice = pkg.price || 2000000
  
  // Adjust by days (if different from package default)
  const baseDays = pkg.days || 3
  const dayFactor = days.value / baseDays
  
  // Hotel category multiplier
  const hotelMultiplier = hotelOptions.value.find(h => h.value === hotelCategory.value)?.multiplier || 1
  
  // Group discount (more people = cheaper per person)
  let groupDiscount = 1
  if (pax.value >= 10) groupDiscount = 0.85
  else if (pax.value >= 6) groupDiscount = 0.9
  else if (pax.value >= 4) groupDiscount = 0.95

  const pricePerPerson = Math.round(basePrice * dayFactor * hotelMultiplier * groupDiscount)
  const total = pricePerPerson * pax.value

  result.value = {
    pricePerPerson,
    total,
    pax: pax.value,
    packageName: pkg.title
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>
