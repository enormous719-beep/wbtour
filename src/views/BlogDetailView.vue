<template>
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
    <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <!-- Not found -->
  <div v-else-if="!blog" class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 dark:bg-slate-900">
    <div class="text-5xl mb-4">📝</div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Artikel Tidak Ditemukan</h1>
    <RouterLink to="/blog" class="mt-4 text-sm text-emerald-600 hover:text-emerald-500">← Kembali ke Blog</RouterLink>
  </div>

  <!-- Article -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 transition-colors duration-300">

    <!-- Hero -->
    <div class="relative w-full h-64 md:h-80 overflow-hidden bg-gray-200 dark:bg-slate-700">
      <img v-if="blog.thumbnail" :src="blog.thumbnail" :alt="blog.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div class="max-w-3xl mx-auto">
          <span class="inline-block bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {{ blog.category }}
          </span>
          <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">{{ blog.title }}</h1>
        </div>
      </div>
    </div>

    <!-- Meta + Content -->
    <div class="max-w-3xl mx-auto px-6 mt-8">

      <!-- Meta -->
      <div class="flex items-center gap-4 text-xs text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          {{ blog.author }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {{ formatDate(blog.createdAt) }}
        </span>
      </div>

      <!-- Excerpt -->
      <p class="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 font-medium italic border-l-4 border-emerald-400 pl-4">
        {{ blog.excerpt }}
      </p>

      <!-- Content — render markdown-like -->
      <div class="prose-content text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
        <template v-for="(block, i) in parsedContent" :key="i">
          <h2 v-if="block.type === 'h2'" class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{{ block.text }}</h2>
          <h3 v-else-if="block.type === 'h3'" class="text-base font-bold text-gray-900 dark:text-white mt-6 mb-2">{{ block.text }}</h3>
          <p v-else-if="block.type === 'p'" class="text-sm leading-relaxed text-gray-600 dark:text-gray-400" v-html="block.html"></p>
          <div v-else-if="block.type === 'empty'" class="h-2"></div>
        </template>
      </div>

      <!-- Back + CTA -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <RouterLink to="/blog" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Blog
        </RouterLink>
        <RouterLink to="/packages" class="px-5 py-2.5 bg-gray-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors">
          Lihat Paket Wisata →
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const blog = ref(null)
const loading = ref(true)

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blogs/${route.params.slug}`)
  if (res.ok) blog.value = await res.json()
  loading.value = false
})

// Parser sederhana untuk markdown-like content
const parsedContent = computed(() => {
  if (!blog.value?.content) return []
  return blog.value.content.split('\n').map(line => {
    if (line.startsWith('## ')) return { type: 'h2', text: line.slice(3) }
    if (line.startsWith('### ')) return { type: 'h3', text: line.slice(4) }
    if (line.trim() === '') return { type: 'empty' }
    // Bold **text**
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return { type: 'p', html }
  })
})

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
