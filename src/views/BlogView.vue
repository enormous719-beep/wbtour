<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

    <!-- HEADER -->
    <div class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-14 px-6 text-center">
      <div class="max-w-2xl mx-auto">
        <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-3">Blog & Tips</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Inspirasi Perjalanan</h1>
        <p class="text-gray-400 text-sm leading-relaxed">Tips wisata, panduan destinasi, dan cerita perjalanan dari tim Wahyu Bandung Tour.</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-12">

      <!-- Filter kategori -->
      <div class="flex flex-wrap gap-2 mb-10">
        <button
          v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-colors border',
            activeCategory === cat
              ? 'bg-gray-900 dark:bg-slate-600 text-white border-gray-900 dark:border-slate-600'
              : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-100 dark:bg-slate-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="text-center py-20">
        <div class="text-4xl mb-3">📝</div>
        <p class="text-gray-400 text-sm">Belum ada artikel di kategori ini.</p>
      </div>

      <!-- Grid artikel -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="blog in filtered" :key="blog.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
          @click="router.push({ name: 'blog-detail', params: { slug: blog.slug } })"
        >
          <!-- Thumbnail -->
          <div class="relative h-44 overflow-hidden">
            <img
              v-if="blog.thumbnail"
              :src="blog.thumbnail"
              :alt="blog.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-300 text-4xl">📝</div>
            <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              {{ blog.category }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {{ blog.title }}
            </h2>
            <p class="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{{ blog.excerpt }}</p>
            <div class="flex items-center justify-between text-[11px] text-gray-400">
              <span>{{ blog.author }}</span>
              <span>{{ formatDate(blog.createdAt) }}</span>
            </div>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const blogs = ref([])
const loading = ref(true)
const activeCategory = ref('Semua')

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blogs`)
  blogs.value = await res.json()
  loading.value = false
})

const categories = computed(() => {
  const cats = [...new Set(blogs.value.map(b => b.category))]
  return ['Semua', ...cats]
})

const filtered = computed(() =>
  activeCategory.value === 'Semua'
    ? blogs.value
    : blogs.value.filter(b => b.category === activeCategory.value)
)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
