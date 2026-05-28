<template>
  <div class="overflow-x-hidden">

    <!-- HERO SECTION -->
    <section id="home" class="relative w-screen h-screen overflow-hidden">
      <!-- Slider Images -->
      <transition-group name="fade-slide" tag="div">
        <img
          v-for="(img, i) in heroImages"
          v-show="currentSlide === i"
          :key="i"
          :src="img"
          alt="Hero"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </transition-group>

      <!-- Overlay gradient gelap ke bawah -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>

      <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
        <!-- Badge -->
        <span class="mb-5 inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-xs font-medium tracking-widest uppercase text-white/80">
          Wahyu Bandung Tour
        </span>

        <h1 class="mb-4 text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
          Jelajahi Dunia<br />
          <span class="text-emerald-400">Bersama Kami</span>
        </h1>

        <p class="mb-10 text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
          Paket wisata terbaik dengan harga bersahabat dan pelayanan profesional untuk perjalanan tak terlupakan.
        </p>

        <!-- Search Bar -->
        <div class="flex w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <input
            v-model="q"
            type="text"
            placeholder="Cari destinasi atau paket..."
            class="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/50 outline-none text-sm"
            @keyup.enter="goSearch"
          />
          <button
            class="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors duration-200"
            @click="goSearch"
          >
            Cari
          </button>
        </div>

        <!-- Slide indicators -->
        <div class="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          <button
            v-for="(_, i) in heroImages"
            :key="i"
            @click="goToSlide(i)"
            class="transition-all duration-300 rounded-full"
            :class="currentSlide === i
              ? 'w-6 h-2 bg-white'
              : 'w-2 h-2 bg-white/40 hover:bg-white/70'"
          />
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
          <span class="tracking-widest uppercase text-[10px]">Scroll</span>
          <div class="w-px h-6 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </div>
    </section>

    <!-- STATS STRIP -->
    <section class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 transition-colors duration-300">
      <div class="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">500+</div>
          <div class="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1 tracking-wide">Pelanggan Puas</div>
        </div>
        <div class="border-x border-gray-100 dark:border-slate-700">
          <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">20+</div>
          <div class="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1 tracking-wide">Destinasi</div>
        </div>
        <div>
          <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">5★</div>
          <div class="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1 tracking-wide">Rating</div>
        </div>
      </div>
    </section>

    <!-- PAKET POPULER -->
    <section class="bg-gray-50 dark:bg-slate-900 py-20 px-6 md:px-12 transition-colors duration-300">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-2">Pilihan Terbaik</p>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Paket Populer</h2>
          </div>
          <button
            @click="router.push({ name: 'packages' })"
            class="self-start md:self-auto text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            Lihat semua paket
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        <!-- Cards Grid -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(pkg, i) in featured"
            :key="i"
            class="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
            @click="goDetail(pkg)"
          >
            <!-- Image -->
            <div class="relative overflow-hidden h-52">
              <img
                :src="pkg.image"
                :alt="pkg.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <!-- Badge harga -->
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm">
                Mulai Rp {{ (pkg.price / 1000000).toFixed(1) }}jt
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1.5">{{ pkg.name }}</h3>
              <p class="text-sm text-gray-400 dark:text-gray-500 leading-relaxed mb-4 line-clamp-2">{{ pkg.desc }}</p>

              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Indonesia
                </span>
                <span class="text-xs font-medium text-emerald-600 group-hover:text-emerald-500 flex items-center gap-1 transition-colors">
                  Lihat detail
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TENTANG KAMI -->
    <section id="about" class="bg-white dark:bg-slate-800 py-24 px-6 md:px-12 transition-colors duration-300">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <!-- Image -->
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1500&auto=format&fit=crop"
            class="w-full rounded-3xl object-cover aspect-[4/3]"
            alt="Tentang Kami"
          />
          <!-- Floating card -->
          <div class="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 hidden md:block">
            <div class="text-2xl font-bold text-gray-900">10+</div>
            <div class="text-xs text-gray-400 mt-0.5">Tahun Pengalaman</div>
          </div>
        </div>

        <!-- Text -->
        <div>
          <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-3">Tentang Kami</p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Partner Perjalanan<br />Terpercaya Anda
          </h2>
          <p class="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            <strong class="text-gray-700 dark:text-gray-200">Wbtour</strong> adalah partner perjalanan Anda dalam mewujudkan liburan impian. Kami menyediakan berbagai pilihan paket wisata terbaik dengan harga bersahabat dan pelayanan profesional.
          </p>
          <p class="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            Dengan jaringan luas dan pengalaman bertahun-tahun, kami siap membantu Anda menjelajahi keindahan dunia dengan aman dan nyaman.
          </p>

          <!-- Features -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div v-for="feat in features" :key="feat.label" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-emerald-500 text-sm">{{ feat.icon }}</span>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ feat.label }}</div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ feat.desc }}</div>
              </div>
            </div>
          </div>

          <a
            :href="`https://wa.me/6282227227039?text=${encodeURIComponent('Halo, saya ingin tanya paket wisata.')}`"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            Hubungi Kami
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- BLOG PREVIEW -->
    <section class="bg-gray-50 dark:bg-slate-900 py-20 px-6 md:px-12 transition-colors duration-300">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p class="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-2">Tips & Inspirasi</p>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Dari Blog Kami</h2>
          </div>
          <RouterLink to="/blog" class="self-start md:self-auto text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors">
            Lihat semua artikel
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </RouterLink>
        </div>

        <div v-if="blogsLoading" class="grid gap-6 md:grid-cols-3">
          <div v-for="n in 3" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse">
            <div class="h-40 bg-gray-100 dark:bg-slate-700"></div>
            <div class="p-5 space-y-2">
              <div class="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
              <div class="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-3">
          <article
            v-for="blog in latestBlogs" :key="blog.id"
            class="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer"
            @click="router.push({ name: 'blog-detail', params: { slug: blog.slug } })"
          >
            <div class="h-40 overflow-hidden relative">
              <img v-if="blog.thumbnail" :src="blog.thumbnail" :alt="blog.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-3xl text-gray-300">📝</div>
              <span class="absolute top-3 left-3 bg-white/90 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg">{{ blog.category }}</span>
            </div>
            <div class="p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{{ blog.title }}</h3>
              <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{{ blog.excerpt }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="bg-gray-900 py-20 px-6 text-center">
      <div class="max-w-2xl mx-auto">
        <p class="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">Siap Berangkat?</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Rencanakan Perjalanan<br />Impian Anda Sekarang
        </h2>
        <p class="text-gray-400 mb-8 leading-relaxed">
          Konsultasikan perjalanan Anda dengan tim kami. Gratis, tanpa komitmen.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="router.push({ name: 'packages' })"
            class="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            Lihat Semua Paket
          </button>
          <a
            :href="`https://wa.me/6282227227039?text=${encodeURIComponent('Halo, saya ingin konsultasi paket wisata.')}`"
            target="_blank"
            class="px-7 py-3.5 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import heroImg from "../assets/hero.jpeg";
import hero2Img from "../assets/hero2.jpeg";
import hero3Img from "../assets/hero3.jpeg";

const router = useRouter();
const q = ref("");

// Hero slider
const heroImages = [heroImg, hero2Img, hero3Img];
const currentSlide = ref(0);
let sliderTimer = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % heroImages.length;
}

function goToSlide(i) {
  currentSlide.value = i;
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 5000);
}

onMounted(() => {
  sliderTimer = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  clearInterval(sliderTimer);
});

// Blog preview
const latestBlogs = ref([])
const blogsLoading = ref(true)
onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/blogs`)
    const data = await res.json()
    latestBlogs.value = data.slice(0, 3)
  } catch { /* silent */ } finally {
    blogsLoading.value = false
  }
})

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

function goDetail(pkg) {
  router.push({
    name: "package-detail",
    params: { slug: slugify(pkg.name) }
  });
}

function goSearch() {
  router.push({ name: 'packages', query: { q: q.value || "" } });
}

const featured = [
  {
    name: "Bali Getaway",
    desc: "Nikmati liburan tropis di Bali dengan akomodasi terbaik dan pemandangan yang memukau.",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Tour Yogyakarta",
    desc: "Jelajahi budaya dan alam Yogyakarta yang kaya sejarah dan penuh pesona.",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Labuan Bajo",
    desc: "Nikmati keindahan komodo dan pulau-pulau eksotis di ujung timur Flores.",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1000&auto=format&fit=crop",
  },
];

const features = [
  { icon: "✓", label: "Harga Transparan", desc: "Tanpa biaya tersembunyi" },
  { icon: "✓", label: "Guide Berpengalaman", desc: "Tim profesional kami" },
  { icon: "✓", label: "Akomodasi Terjamin", desc: "Hotel pilihan terbaik" },
  { icon: "✓", label: "Layanan 24/7", desc: "Siap membantu kapanpun" },
];
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hero slider fade transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  inset: 0;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
}
</style>
