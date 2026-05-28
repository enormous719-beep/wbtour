<template>
  <div class="p-8 max-w-5xl">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">Paket Wisata</h1>
        <p class="text-zinc-500 text-sm mt-1">Kelola semua paket wisata</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors">
        + Tambah Paket
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-20 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-zinc-800/60">
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Paket</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Kota</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Durasi</th>
            <th class="text-left px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Harga</th>
            <th class="text-right px-6 py-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/40">
          <tr v-for="pkg in packages" :key="pkg.id" class="hover:bg-zinc-800/20 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img v-if="pkg.thumbnail" :src="pkg.thumbnail" class="w-12 h-9 object-cover rounded-lg bg-zinc-800" />
                <div v-else class="w-12 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">?</div>
                <div>
                  <div class="text-white font-medium text-sm">{{ pkg.title }}</div>
                  <div class="text-zinc-600 text-xs font-mono">{{ pkg.slug }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-zinc-400 text-sm">{{ pkg.city }}</td>
            <td class="px-6 py-4 text-zinc-400 text-sm">{{ pkg.days }}H {{ pkg.nights }}M</td>
            <td class="px-6 py-4 text-emerald-400 font-semibold text-sm">{{ formatIDR(pkg.price) }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="openForm(pkg)" class="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">Edit</button>
                <button @click="deletePackage(pkg)" class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 rounded-lg transition-colors">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL FORM -->
    <div v-if="showForm" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4" @click.self="showForm = false">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <h2 class="text-sm font-semibold text-white">{{ editingPkg ? 'Edit Paket' : 'Tambah Paket Baru' }}</h2>
          <button @click="showForm = false" class="text-zinc-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <!-- Tab nav -->
        <div class="flex border-b border-zinc-800 flex-shrink-0">
          <button
            v-for="tab in tabs" :key="tab.key"
            @click="activeTab = tab.key"
            :class="['flex-1 py-3 text-xs font-semibold transition-colors', activeTab === tab.key ? 'text-white border-b-2 border-emerald-500 -mb-px' : 'text-zinc-600 hover:text-zinc-300']"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Scrollable body -->
        <form @submit.prevent="savePackage" class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-4">

            <!-- TAB: INFO DASAR -->
            <template v-if="activeTab === 'info'">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="form-label">Nama Paket *</label>
                  <input v-model="form.title" type="text" required class="input-field" placeholder="Bali 3D2N Budget" />
                </div>
                <div>
                  <label class="form-label">Kota *</label>
                  <input v-model="form.city" type="text" required class="input-field" placeholder="Bali" />
                </div>
                <div>
                  <label class="form-label">Harga (Rp) *</label>
                  <input v-model="form.price" type="number" required class="input-field" placeholder="1850000" />
                </div>
                <div>
                  <label class="form-label">Hari</label>
                  <input v-model="form.days" type="number" min="1" class="input-field" />
                </div>
                <div>
                  <label class="form-label">Malam</label>
                  <input v-model="form.nights" type="number" min="0" class="input-field" />
                </div>

                <!-- FOTO -->
                <div class="col-span-2">
                  <label class="form-label">Foto Paket</label>
                  <div class="flex gap-2 mb-3">
                    <button type="button" @click="imageMode = 'upload'" :class="modeBtn(imageMode === 'upload')">Upload File</button>
                    <button type="button" @click="imageMode = 'url'" :class="modeBtn(imageMode === 'url')">Pakai URL</button>
                  </div>
                  <div v-if="imageMode === 'upload'">
                    <label class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors relative overflow-hidden">
                      <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <div class="relative z-10 flex flex-col items-center gap-1 text-zinc-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span class="text-xs">{{ previewUrl ? 'Ganti foto' : 'Klik untuk pilih foto' }}</span>
                        <span class="text-[10px] text-zinc-700">JPG, PNG, WEBP — maks 5MB</span>
                      </div>
                      <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                    </label>
                    <p v-if="uploadError" class="text-red-400 text-xs mt-1">{{ uploadError }}</p>
                  </div>
                  <div v-else>
                    <input v-model="form.thumbnail" type="url" class="input-field" placeholder="https://images.unsplash.com/..." />
                    <div v-if="form.thumbnail" class="mt-2 rounded-xl overflow-hidden h-20 border border-zinc-700">
                      <img :src="form.thumbnail" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div class="col-span-2">
                  <label class="form-label">Highlights <span class="text-zinc-700">(pisah koma)</span></label>
                  <input v-model="form.highlightsRaw" type="text" class="input-field" placeholder="Tanah Lot, Tegalalang, Pantai Pandawa" />
                </div>
                <div class="col-span-2">
                  <label class="form-label">Include <span class="text-zinc-700">(pisah koma)</span></label>
                  <textarea v-model="form.includesRaw" rows="2" class="input-field resize-none" placeholder="Hotel 2 malam, Sarapan, Mobil + driver"></textarea>
                </div>
                <div class="col-span-2">
                  <label class="form-label">Exclude <span class="text-zinc-700">(pisah koma)</span></label>
                  <textarea v-model="form.excludesRaw" rows="2" class="input-field resize-none" placeholder="Tiket pesawat, Pengeluaran pribadi"></textarea>
                </div>
              </div>
            </template>

            <!-- TAB: ITINERARY -->
            <template v-if="activeTab === 'itinerary'">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-zinc-600">Setiap hari bisa punya beberapa kegiatan.</p>
                <button type="button" @click="addDay" class="text-xs text-emerald-500 hover:text-emerald-400">+ Tambah Hari</button>
              </div>
              <div v-if="form.itinerary.length === 0" class="text-center py-10 text-zinc-700 text-sm border border-dashed border-zinc-800 rounded-xl">
                Belum ada itinerary. Klik "+ Tambah Hari" untuk mulai.
              </div>
              <div v-for="(day, di) in form.itinerary" :key="di" class="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-white">Hari {{ di + 1 }}</span>
                  <button type="button" @click="removeDay(di)" class="text-xs text-red-400 hover:text-red-300">Hapus Hari</button>
                </div>
                <div v-for="(activity, ai) in day" :key="ai" class="flex gap-2 items-center">
                  <input :value="activity" @input="updateActivity(di, ai, $event.target.value)" type="text" class="input-field flex-1" :placeholder="`Kegiatan ${ai + 1}...`" />
                  <button type="button" @click="removeActivity(di, ai)" class="text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <button type="button" @click="addActivity(di)" class="text-xs text-zinc-600 hover:text-emerald-400 transition-colors mt-1">
                  + Tambah kegiatan
                </button>
              </div>
            </template>

            <!-- TAB: HARGA -->
            <template v-if="activeTab === 'harga'">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-zinc-600">Opsi harga berdasarkan jumlah peserta.</p>
                <button type="button" @click="addPriceOption" class="text-xs text-emerald-500 hover:text-emerald-400">+ Tambah Opsi</button>
              </div>
              <div v-if="form.priceOptions.length === 0" class="text-center py-10 text-zinc-700 text-sm border border-dashed border-zinc-800 rounded-xl">
                Belum ada opsi harga.
              </div>
              <div v-for="(opt, oi) in form.priceOptions" :key="oi" class="flex gap-3 items-center">
                <input v-model="opt.name" type="text" class="input-field flex-1" placeholder="2–3 Pax" />
                <input v-model="opt.price" type="number" class="input-field w-36" placeholder="1850000" />
                <button type="button" @click="removePriceOption(oi)" class="text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </template>

          </div>

          <!-- Footer form -->
          <div class="px-6 pb-6 flex items-center justify-between gap-3">
            <p v-if="formError" class="text-red-400 text-xs">{{ formError }}</p>
            <div class="flex gap-2 ml-auto">
              <button type="button" @click="showForm = false" class="px-5 py-2.5 border border-zinc-700 text-zinc-400 text-sm font-medium rounded-xl hover:border-zinc-600 hover:text-zinc-200 transition-colors">
                Batal
              </button>
              <button type="submit" :disabled="saving" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                {{ saving ? 'Menyimpan...' : (editingPkg ? 'Simpan' : 'Tambah Paket') }}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { formatIDR } from '@/data/packages'

const admin = useAdminStore()
const packages = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingPkg = ref(null)
const saving = ref(false)
const formError = ref('')
const activeTab = ref('info')

const tabs = [
  { key: 'info', label: 'Info Dasar' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'harga', label: 'Opsi Harga' },
]

const imageMode = ref('upload')
const previewUrl = ref('')
const selectedFile = ref(null)
const uploadError = ref('')

const emptyForm = () => ({
  title: '', city: '', price: '', days: 1, nights: 0,
  thumbnail: '', highlightsRaw: '', includesRaw: '', excludesRaw: '',
  itinerary: [], priceOptions: [],
})
const form = ref(emptyForm())

onMounted(fetchPackages)

async function fetchPackages() {
  loading.value = true
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/packages`)
  packages.value = await res.json()
  loading.value = false
}

function openForm(pkg = null) {
  editingPkg.value = pkg
  formError.value = ''
  uploadError.value = ''
  previewUrl.value = ''
  selectedFile.value = null
  activeTab.value = 'info'
  if (pkg) {
    form.value = {
      title: pkg.title, city: pkg.city, price: pkg.price,
      days: pkg.days, nights: pkg.nights, thumbnail: pkg.thumbnail || '',
      highlightsRaw: (pkg.highlights || []).join(', '),
      includesRaw: (pkg.includes || []).join(', '),
      excludesRaw: (pkg.excludes || []).join(', '),
      itinerary: (pkg.itinerary || []).map(day => [...day]),
      priceOptions: (pkg.priceOptions || []).map(o => ({ ...o })),
    }
    if (pkg.thumbnail?.startsWith('/uploads/')) { imageMode.value = 'upload'; previewUrl.value = pkg.thumbnail }
    else { imageMode.value = pkg.thumbnail ? 'url' : 'upload' }
  } else {
    form.value = emptyForm()
    imageMode.value = 'upload'
  }
  showForm.value = true
}

function addDay() { form.value.itinerary.push(['']) }
function removeDay(di) { form.value.itinerary.splice(di, 1) }
function addActivity(di) { form.value.itinerary[di].push('') }
function removeActivity(di, ai) { form.value.itinerary[di].splice(ai, 1) }
function updateActivity(di, ai, val) { form.value.itinerary[di][ai] = val }
function addPriceOption() { form.value.priceOptions.push({ name: '', price: '' }) }
function removePriceOption(oi) { form.value.priceOptions.splice(oi, 1) }

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { uploadError.value = 'Ukuran file maksimal 5MB'; return }
  uploadError.value = ''
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function modeBtn(active) {
  return active
    ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 border border-zinc-700 hover:text-zinc-300'
}

function splitComma(str) { return str.split(',').map(s => s.trim()).filter(Boolean) }

async function savePackage() {
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
    const payload = {
      title: form.value.title, city: form.value.city,
      price: Number(form.value.price), days: Number(form.value.days), nights: Number(form.value.nights),
      thumbnail: thumbnailUrl, thumbnailLarge: thumbnailUrl,
      highlights: splitComma(form.value.highlightsRaw),
      includes: splitComma(form.value.includesRaw),
      excludes: splitComma(form.value.excludesRaw),
      itinerary: form.value.itinerary.map(d => d.filter(a => a.trim())).filter(d => d.length),
      priceOptions: form.value.priceOptions.filter(o => o.name && o.price).map(o => ({ name: o.name, price: Number(o.price) })),
    }
    const url = editingPkg.value ? `${import.meta.env.VITE_API_URL || ''}/api/packages/${editingPkg.value.slug}` : `${import.meta.env.VITE_API_URL || ''}/api/packages`
    const method = editingPkg.value ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: admin.authHeaders(), body: JSON.stringify(payload) })
    if (!res.ok) throw new Error((await res.json()).error || 'Gagal menyimpan')
    await fetchPackages()
    showForm.value = false
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

async function deletePackage(pkg) {
  if (!confirm(`Hapus paket "${pkg.title}"?`)) return
  await fetch(`${import.meta.env.VITE_API_URL || ''}/api/packages/${pkg.slug}`, { method: 'DELETE', headers: admin.authHeaders() })
  await fetchPackages()
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
