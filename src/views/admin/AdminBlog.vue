<template>
  <div class="p-8 max-w-none w-full">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">Blog</h1>
        <p class="text-zinc-500 text-sm mt-1">Kelola artikel dan konten blog</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors">
        + Tulis Artikel
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-20 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden">
      <div v-if="blogs.length === 0" class="py-16 text-center">
        <div class="text-3xl mb-3 opacity-20">📝</div>
        <p class="text-zinc-600 text-sm">Belum ada artikel. Klik "+ Tulis Artikel" untuk mulai.</p>
      </div>
      <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-800/60">
            <th class="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Artikel</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider w-24">Kategori</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider w-28">Status</th>
            <th class="text-left px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider w-24">Tanggal</th>
            <th class="text-right px-4 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider w-40">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/40">
          <tr v-for="blog in blogs" :key="blog.id" class="hover:bg-zinc-800/20 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="blog.thumbnail" :src="blog.thumbnail" class="w-10 h-8 object-cover rounded-lg bg-zinc-800 flex-shrink-0" />
                <div v-else class="w-10 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs flex-shrink-0">📝</div>
                <div class="min-w-0">
                  <div class="text-white font-medium text-xs truncate max-w-[200px]">{{ blog.title }}</div>
                  <div class="text-zinc-600 text-[10px] font-mono truncate max-w-[200px]">{{ blog.slug }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-lg whitespace-nowrap">{{ blog.category }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="blog.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-zinc-800 text-zinc-500 border-zinc-700'"
                class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg border whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="blog.published ? 'bg-emerald-400' : 'bg-zinc-600'"></span>
                {{ blog.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{{ formatDate(blog.createdAt) }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button @click="togglePublish(blog)" :class="blog.published ? 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'"
                  class="px-2 py-1 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap">
                  {{ blog.published ? 'Unpublish' : 'Publish' }}
                </button>
                <button @click="openForm(blog)" class="px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">Edit</button>
                <button @click="deleteBlog(blog)" class="px-2 py-1 text-[11px] font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 rounded-lg transition-colors">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- MODAL FORM -->
    <div v-if="showForm" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4" @click.self="showForm = false">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

        <div class="px-6 py-5 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <h2 class="text-sm font-semibold text-white">{{ editingBlog ? 'Edit Artikel' : 'Tulis Artikel Baru' }}</h2>
          <button @click="showForm = false" class="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <form @submit.prevent="saveBlog" class="flex-1 overflow-y-auto p-6 space-y-4">

          <div>
            <label class="form-label">Judul Artikel *</label>
            <input v-model="form.title" type="text" required class="input-field" placeholder="5 Tips Liburan Hemat ke Bali..." />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Kategori</label>
              <input v-model="form.category" type="text" class="input-field" placeholder="Tips Wisata" list="category-list" />
              <datalist id="category-list">
                <option v-for="cat in existingCategories" :key="cat" :value="cat" />
              </datalist>
            </div>
            <div>
              <label class="form-label">Penulis</label>
              <input v-model="form.author" type="text" class="input-field" placeholder="Tim WBTour" />
            </div>
          </div>

          <div>
            <label class="form-label">Thumbnail</label>
            <div class="flex gap-2 mb-2">
              <button type="button" @click="imageMode = 'upload'" :class="modeBtn(imageMode === 'upload')">Upload File</button>
              <button type="button" @click="imageMode = 'url'" :class="modeBtn(imageMode === 'url')">Pakai URL</button>
            </div>
            <div v-if="imageMode === 'upload'">
              <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors relative overflow-hidden">
                <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div class="relative z-10 flex flex-col items-center gap-1 text-zinc-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span class="text-xs">{{ previewUrl ? 'Ganti foto' : 'Klik untuk pilih foto' }}</span>
                </div>
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
              <p v-if="uploadError" class="text-red-400 text-xs mt-1">{{ uploadError }}</p>
            </div>
            <div v-else>
              <input v-model="form.thumbnail" type="url" class="input-field" placeholder="https://..." />
              <div v-if="form.thumbnail" class="mt-2 rounded-xl overflow-hidden h-16 border border-zinc-700">
                <img :src="form.thumbnail" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div>
            <label class="form-label">Excerpt <span class="text-zinc-700">(ringkasan singkat)</span></label>
            <textarea v-model="form.excerpt" rows="2" class="input-field resize-none" placeholder="Deskripsi singkat artikel yang muncul di halaman list..."></textarea>
          </div>

          <div>
            <label class="form-label">
              Konten *
              <span class="text-zinc-700 font-normal ml-1">— gunakan ## untuk heading, **teks** untuk bold</span>
            </label>
            <textarea v-model="form.content" rows="12" required class="input-field resize-none font-mono text-xs leading-relaxed" placeholder="## Judul Section&#10;&#10;Isi konten artikel di sini...&#10;&#10;Gunakan **teks tebal** untuk penekanan."></textarea>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="form.published = !form.published"
              :class="['relative w-10 h-5 rounded-full transition-colors', form.published ? 'bg-emerald-500' : 'bg-zinc-700']"
            >
              <span :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.published ? 'translate-x-5' : 'translate-x-0.5']"></span>
            </button>
            <span class="text-sm text-zinc-400">{{ form.published ? 'Published — tampil di website' : 'Draft — tidak tampil di website' }}</span>
          </div>

          <p v-if="formError" class="text-red-400 text-xs">{{ formError }}</p>

          <div class="flex gap-2 pt-2">
            <button type="button" @click="showForm = false" class="px-5 py-2.5 border border-zinc-700 text-zinc-400 text-sm font-medium rounded-xl hover:border-zinc-600 hover:text-zinc-200 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="saving" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors ml-auto">
              {{ saving ? 'Menyimpan...' : (editingBlog ? 'Simpan' : 'Publikasikan') }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const blogs = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingBlog = ref(null)
const saving = ref(false)
const formError = ref('')
const imageMode = ref('url')
const previewUrl = ref('')
const selectedFile = ref(null)
const uploadError = ref('')

const emptyForm = () => ({
  title: '', excerpt: '', content: '', category: 'Tips Wisata',
  author: 'Tim WBTour', thumbnail: '', published: false,
})
const form = ref(emptyForm())

const existingCategories = computed(() => [...new Set(blogs.value.map(b => b.category))])

onMounted(fetchBlogs)

async function fetchBlogs() {
  loading.value = true
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/blogs`, { headers: admin.authHeaders() })
  blogs.value = await res.json()
  loading.value = false
}

function openForm(blog = null) {
  editingBlog.value = blog
  formError.value = ''
  uploadError.value = ''
  previewUrl.value = ''
  selectedFile.value = null
  if (blog) {
    form.value = { title: blog.title, excerpt: blog.excerpt, content: blog.content, category: blog.category, author: blog.author, thumbnail: blog.thumbnail || '', published: blog.published }
    imageMode.value = blog.thumbnail?.startsWith('/uploads/') ? 'upload' : 'url'
    if (blog.thumbnail?.startsWith('/uploads/')) previewUrl.value = blog.thumbnail
  } else {
    form.value = emptyForm()
    imageMode.value = 'url'
  }
  showForm.value = true
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { uploadError.value = 'Maks 5MB'; return }
  uploadError.value = ''
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function modeBtn(active) {
  return active
    ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 border border-zinc-700 hover:text-zinc-300'
}

async function saveBlog() {
  saving.value = true
  formError.value = ''
  try {
    let thumbnailUrl = form.value.thumbnail
    if (imageMode.value === 'upload' && selectedFile.value) {
      const fd = new FormData()
      fd.append('image', selectedFile.value)
      const upRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${admin.token}` }, body: fd })
      if (!upRes.ok) throw new Error('Gagal upload foto')
      thumbnailUrl = (await upRes.json()).url
    } else if (imageMode.value === 'upload' && previewUrl.value?.startsWith('/uploads/')) {
      thumbnailUrl = previewUrl.value
    }

    const payload = { ...form.value, thumbnail: thumbnailUrl }
    const url = editingBlog.value ? `${import.meta.env.VITE_API_URL || ''}/api/admin/blogs/${editingBlog.value.slug}` : `${import.meta.env.VITE_API_URL || ''}/api/admin/blogs`
    const method = editingBlog.value ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: admin.authHeaders(), body: JSON.stringify(payload) })
    if (!res.ok) throw new Error((await res.json()).error || 'Gagal menyimpan')
    await fetchBlogs()
    showForm.value = false
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

async function togglePublish(blog) {
  await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/blogs/${blog.slug}`, {
    method: 'PUT', headers: admin.authHeaders(),
    body: JSON.stringify({ published: !blog.published }),
  })
  await fetchBlogs()
}

async function deleteBlog(blog) {
  if (!confirm(`Hapus artikel "${blog.title}"?`)) return
  await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/blogs/${blog.slug}`, { method: 'DELETE', headers: admin.authHeaders() })
  await fetchBlogs()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 text-sm outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10 transition-all;
}
.form-label {
  @apply block text-xs font-medium text-zinc-500 mb-1.5;
}
</style>
