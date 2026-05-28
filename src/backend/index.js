const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const app = express()
const PORT = 3000

app.use(express.json())

// =====================
// JSON FILE STORAGE
// Semua data disimpan ke db.json, persist saat restart
// =====================
const DB_PATH = path.join(__dirname, 'db.json')

const DEFAULT_DB = {
  packages: [
    {
      id: 1,
      slug: 'bali-3d2n-budget',
      title: 'Bali 3D2N Budget',
      city: 'Bali',
      days: 3,
      nights: 2,
      price: 1850000,
      thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      thumbnailLarge: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop',
      highlights: ['Tanah Lot', 'Tegalalang', 'Pantai Pandawa'],
      includes: ['Hotel 2 malam', 'Sarapan', 'Mobil + driver', 'BBM', 'Tiket objek wisata'],
      excludes: ['Tiket pesawat', 'Pengeluaran pribadi', 'Makan di luar itinerary'],
      itinerary: [
        ['Penjemputan di Bandara', 'Mengunjungi Tanah Lot', 'Check-in hotel & istirahat'],
        ['Sarapan hotel', 'Mengunjungi Tegalalang Rice Terrace', 'Kopi Luwak tour', 'Kuta sunset'],
        ['Pantai Pandawa', 'Belanja oleh-oleh', 'Transfer ke bandara'],
      ],
      priceOptions: [
        { name: '2–3 Pax', price: 2050000 },
        { name: '4–6 Pax', price: 1850000 },
        { name: '7–10 Pax', price: 1650000 },
      ],
    },
    {
      id: 2,
      slug: 'labuan-bajo-4d3n',
      title: 'Labuan Bajo 4D3N Open Trip',
      city: 'Labuan Bajo',
      days: 4,
      nights: 3,
      price: 3950000,
      thumbnail: 'https://images.unsplash.com/photo-1558981124-5c03e2b2739d?q=80&w=1600&auto=format&fit=crop',
      thumbnailLarge: 'https://images.unsplash.com/photo-1558981124-5c03e2b2739d?q=80&w=2000&auto=format&fit=crop',
      highlights: ['Pulau Padar', 'Pulau Komodo', 'Pink Beach'],
      includes: ['Live on board', 'Makan 3x sehari', 'Guide', 'Dokumentasi'],
      excludes: ['Tiket pesawat', 'Tip guide', 'Pengeluaran pribadi'],
      itinerary: [
        ['Check-in kapal', 'Snorkeling', 'Sunset di Pulau Kanawa'],
        ['Hiking Pulau Padar', 'Pulau Komodo', 'Pink Beach'],
        ['Manta Point', 'Taka Makassar', 'Snorkeling spot rahasia'],
        ['Checkout kapal', 'Belanja oleh-oleh', 'Transfer bandara'],
      ],
      priceOptions: [
        { name: 'Open Trip', price: 3950000 },
        { name: 'Private Trip (min 4 pax)', price: 4750000 },
      ],
    },
    {
      id: 3,
      slug: 'yogyakarta-2d1n',
      title: 'Yogyakarta 2D1N Hemat',
      city: 'Yogyakarta',
      days: 2,
      nights: 1,
      price: 950000,
      thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',
      thumbnailLarge: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop',
      highlights: ['Candi Prambanan', 'Malioboro', 'HeHa Sky View'],
      includes: ['Hotel 1 malam', 'Transport lokal', 'Tiket wisata'],
      excludes: ['Makan siang & malam', 'Pengeluaran pribadi'],
      itinerary: [
        ['Candi Prambanan', 'Malioboro', 'Check-in hotel'],
        ['HeHa Sky View', 'Belanja oleh-oleh', 'Transfer pulang'],
      ],
      priceOptions: [
        { name: '2–3 Pax', price: 1100000 },
        { name: '4–6 Pax', price: 950000 },
      ],
    },
  ],
  orders: [],
  orderIdCounter: 1,
}

// Baca db.json, buat baru kalau belum ada
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(DEFAULT_DB)
    return DEFAULT_DB
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } catch {
    writeDB(DEFAULT_DB)
    return DEFAULT_DB
  }
}

// Tulis ke db.json
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// =====================
// UPLOAD SETUP
// =====================
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Hanya file gambar'))
    cb(null, true)
  }
})

app.use('/uploads', express.static(uploadDir))

// =====================
// AUTH
// =====================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wbtour2024'
const ADMIN_TOKEN = 'wbtour-admin-secret-token'

function requireAuth(req, res, next) {
  if (req.headers['authorization'] !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.post('/api/admin/login', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password salah' })
  }
  res.json({ token: ADMIN_TOKEN })
})

// =====================
// HEALTH CHECK
// =====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend wbtour jalan ✓' })
})

// =====================
// UPLOAD GAMBAR
// =====================
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

// =====================
// PACKAGES — PUBLIC
// =====================
app.get('/api/packages', (req, res) => {
  const { packages } = readDB()
  const { q } = req.query
  if (q) {
    const kw = q.toLowerCase()
    return res.json(packages.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.city.toLowerCase().includes(kw) ||
      (p.highlights || []).some(h => h.toLowerCase().includes(kw))
    ))
  }
  res.json(packages)
})

app.get('/api/packages/:slug', (req, res) => {
  const { packages } = readDB()
  const pkg = packages.find(p => p.slug === req.params.slug)
  if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' })
  res.json(pkg)
})

// =====================
// PACKAGES — ADMIN CRUD
// =====================
app.post('/api/packages', requireAuth, (req, res) => {
  const db = readDB()
  const data = req.body
  if (!data.title || !data.city || !data.price) {
    return res.status(400).json({ error: 'title, city, dan price wajib diisi' })
  }
  const newPkg = {
    id: db.packages.length ? Math.max(...db.packages.map(p => p.id)) + 1 : 1,
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: data.title,
    city: data.city,
    days: data.days || 1,
    nights: data.nights || 0,
    price: Number(data.price),
    thumbnail: data.thumbnail || '',
    thumbnailLarge: data.thumbnailLarge || data.thumbnail || '',
    highlights: data.highlights || [],
    includes: data.includes || [],
    excludes: data.excludes || [],
    itinerary: data.itinerary || [],
    priceOptions: data.priceOptions || [],
  }
  db.packages.push(newPkg)
  writeDB(db)
  res.status(201).json(newPkg)
})

app.put('/api/packages/:slug', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.packages.findIndex(p => p.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Paket tidak ditemukan' })
  db.packages[idx] = { ...db.packages[idx], ...req.body }
  writeDB(db)
  res.json(db.packages[idx])
})

app.delete('/api/packages/:slug', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.packages.findIndex(p => p.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Paket tidak ditemukan' })
  const [deleted] = db.packages.splice(idx, 1)
  writeDB(db)
  res.json({ message: 'Paket dihapus', deleted })
})

// =====================
// ORDERS
// =====================
app.post('/api/orders', (req, res) => {
  const db = readDB()
  const { customerName, customerPhone, items, note } = req.body
  if (!items || !items.length) return res.status(400).json({ error: 'Items kosong' })
  const order = {
    id: db.orderIdCounter++,
    customerName: customerName || 'Tidak diisi',
    customerPhone: customerPhone || 'Tidak diisi',
    items,
    note: note || '',
    totalPrice: items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.orders.push(order)
  writeDB(db)
  res.status(201).json(order)
})

app.get('/api/orders', requireAuth, (req, res) => {
  const { orders } = readDB()
  res.json([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
})

app.patch('/api/orders/:id/status', requireAuth, (req, res) => {
  const db = readDB()
  const order = db.orders.find(o => o.id === Number(req.params.id))
  if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
  const { status } = req.body
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' })
  }
  order.status = status
  writeDB(db)
  res.json(order)
})

app.delete('/api/orders/:id', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.orders.findIndex(o => o.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
  db.orders.splice(idx, 1)
  writeDB(db)
  res.json({ message: 'Pesanan dihapus' })
})

// =====================
// BLOG — PUBLIC
// =====================
app.get('/api/blogs', (req, res) => {
  const { blogs } = readDB()
  const published = blogs
    .filter(b => b.published)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(published)
})

app.get('/api/blogs/:slug', (req, res) => {
  const { blogs } = readDB()
  const blog = blogs.find(b => b.slug === req.params.slug && b.published)
  if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
  res.json(blog)
})

// =====================
// BLOG — ADMIN CRUD
// =====================
app.get('/api/admin/blogs', requireAuth, (req, res) => {
  const { blogs } = readDB()
  res.json([...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
})

app.post('/api/admin/blogs', requireAuth, (req, res) => {
  const db = readDB()
  const data = req.body
  if (!data.title || !data.content) {
    return res.status(400).json({ error: 'title dan content wajib diisi' })
  }
  const newBlog = {
    id: db.blogIdCounter++,
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content,
    category: data.category || 'Umum',
    thumbnail: data.thumbnail || '',
    author: data.author || 'Tim WBTour',
    published: data.published ?? false,
    createdAt: new Date().toISOString(),
  }
  db.blogs.push(newBlog)
  writeDB(db)
  res.status(201).json(newBlog)
})

app.put('/api/admin/blogs/:slug', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.blogs.findIndex(b => b.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
  db.blogs[idx] = { ...db.blogs[idx], ...req.body }
  writeDB(db)
  res.json(db.blogs[idx])
})

app.delete('/api/admin/blogs/:slug', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.blogs.findIndex(b => b.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
  const [deleted] = db.blogs.splice(idx, 1)
  writeDB(db)
  res.json({ message: 'Artikel dihapus', deleted })
})

// =====================
// STATS
// =====================
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const { packages, orders, blogs } = readDB()
  res.json({
    totalPackages: packages.length,
    totalOrders: orders.length,
    totalBlogs: (blogs || []).filter(b => b.published).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    totalRevenue: orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.totalPrice, 0),
  })
})

// =====================
// START
// =====================
app.listen(PORT, () => {
  console.log(`✓ Backend wbtour berjalan di http://localhost:${PORT}`)
  console.log(`  Data tersimpan di: ${DB_PATH}`)
  console.log(`  Password admin   : ${ADMIN_PASSWORD}`)
})
