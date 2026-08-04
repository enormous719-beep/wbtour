const express = require('express')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ferdinandwahyudha800_db_user:aY9BJSFvXBiobNJJ@cluster0.zrpdqwy.mongodb.net/wbtour?appName=Cluster0'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wbtour2024'
const ADMIN_TOKEN = 'wbtour-admin-secret-token'

// =====================
// CLOUDINARY
// =====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvxtbolx4',
  api_key: process.env.CLOUDINARY_API_KEY || '362566112468257',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'VNMRpC2NLqapim9uxYATOFA8JwQ',
})

// =====================
// CORS
// =====================
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    // Allow all Vercel domains
    if (origin && origin.indexOf('.vercel.app') !== -1) {
      return callback(null, true);
    }

    // Allowed custom domains
    const allowedOrigins = [
      'https://wahyubandungtour.com',
      'https://www.wahyubandungtour.com',
      'http://localhost:9000',
      'http://localhost:9001',
      'http://localhost:5173',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Log blocked origins for debugging
    console.log('CORS: Unknown origin -', origin);
    callback(null, true); // Allow anyway for now
  },
  credentials: true,
}))
app.use(express.json())

// =====================
// MONGOOSE MODELS
// =====================
const packageSchema = new mongoose.Schema({
  id: Number,
  slug: { type: String, unique: true },
  title: String,
  city: String,
  days: Number,
  nights: Number,
  price: Number,
  thumbnail: String,
  thumbnailLarge: String,
  highlights: [String],
  includes: [String],
  excludes: [String],
  itinerary: [[String]],
  priceOptions: [{ name: String, price: Number }],
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  items: mongoose.Schema.Types.Mixed,
  note: String,
  totalPrice: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

const blogSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  excerpt: String,
  content: String,
  category: String,
  thumbnail: String,
  author: String,
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const Package = mongoose.model('Package', packageSchema)
const Order = mongoose.model('Order', orderSchema)
const Blog = mongoose.model('Blog', blogSchema)

// =====================
// UPLOAD (Cloudinary)
// =====================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Hanya file gambar'))
    cb(null, true)
  }
})

// =====================
// AUTH
// =====================
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
// HEALTH
// =====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend wbtour jalan ✓', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

// =====================
// UPLOAD
// =====================
app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file' })
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'wbtour', resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      )
      stream.end(req.file.buffer)
    })
    res.json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ error: 'Gagal upload: ' + err.message })
  }
})

// =====================
// PACKAGES — PUBLIC
// =====================
app.get('/api/packages', async (req, res) => {
  try {
    const { q } = req.query
    let query = {}
    if (q) {
      const kw = new RegExp(q, 'i')
      query = { $or: [{ title: kw }, { city: kw }, { highlights: kw }] }
    }
    const packages = await Package.find(query).sort({ id: 1 })
    res.json(packages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/packages/:slug', async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug })
    if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' })
    res.json(pkg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// PACKAGES — ADMIN CRUD
// =====================
app.post('/api/packages', requireAuth, async (req, res) => {
  try {
    const data = req.body
    if (!data.title || !data.city || !data.price) {
      return res.status(400).json({ error: 'title, city, dan price wajib diisi' })
    }
    const count = await Package.countDocuments()
    const pkg = new Package({
      id: count + 1,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: data.title, city: data.city,
      days: data.days || 1, nights: data.nights || 0,
      price: Number(data.price),
      thumbnail: data.thumbnail || '',
      thumbnailLarge: data.thumbnailLarge || data.thumbnail || '',
      highlights: data.highlights || [],
      includes: data.includes || [],
      excludes: data.excludes || [],
      itinerary: data.itinerary || [],
      priceOptions: data.priceOptions || [],
    })
    await pkg.save()
    res.status(201).json(pkg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/packages/:slug', requireAuth, async (req, res) => {
  try {
    const pkg = await Package.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true })
    if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' })
    res.json(pkg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/packages/:slug', requireAuth, async (req, res) => {
  try {
    const pkg = await Package.findOneAndDelete({ slug: req.params.slug })
    if (!pkg) return res.status(404).json({ error: 'Paket tidak ditemukan' })
    res.json({ message: 'Paket dihapus', deleted: pkg })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// ORDERS
// =====================
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, items, note } = req.body
    if (!items || !items.length) return res.status(400).json({ error: 'Items kosong' })
    const order = new Order({
      customerName: customerName || 'Tidak diisi',
      customerPhone: customerPhone || 'Tidak diisi',
      items, note: note || '',
      totalPrice: items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0),
    })
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/orders/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    res.json({ message: 'Pesanan dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// BLOG — PUBLIC
// =====================
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true })
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// BLOG — ADMIN CRUD
// =====================
app.get('/api/admin/blogs', requireAuth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/blogs', requireAuth, async (req, res) => {
  try {
    const data = req.body
    if (!data.title || !data.content) {
      return res.status(400).json({ error: 'title dan content wajib diisi' })
    }
    const blog = new Blog({
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: data.title, excerpt: data.excerpt || '',
      content: data.content, category: data.category || 'Umum',
      thumbnail: data.thumbnail || '', author: data.author || 'Tim WBTour',
      published: data.published ?? false,
    })
    await blog.save()
    res.status(201).json(blog)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/admin/blogs/:slug', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true })
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admin/blogs/:slug', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ error: 'Artikel tidak ditemukan' })
    res.json({ message: 'Artikel dihapus', deleted: blog })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// STATS
// =====================
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const [totalPackages, totalOrders, totalBlogs, pendingOrders, confirmedOrders] = await Promise.all([
      Package.countDocuments(),
      Order.countDocuments(),
      Blog.countDocuments({ published: true }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
    ])
    const revenueResult = await Order.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])
    res.json({
      totalPackages, totalOrders, totalBlogs,
      pendingOrders, confirmedOrders,
      totalRevenue: revenueResult[0]?.total || 0,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =====================
// SEED — isi data awal kalau DB kosong
// =====================
async function seedIfEmpty() {
  const count = await Package.countDocuments()
  if (count > 0) return

  console.log('Seeding initial data...')
  try {
    const dbPath = require('path').join(__dirname, 'db.json')
    const fs = require('fs')
    if (!fs.existsSync(dbPath)) {
      console.log('db.json tidak ditemukan, skip seed.')
      return
    }
    const { packages, blogs } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    if (packages?.length) await Package.insertMany(packages)
    if (blogs?.length) await Blog.insertMany(blogs.map(b => {
      const { _id, id, ...rest } = b
      return rest
    }))
    console.log('Seed selesai.')
  } catch (e) {
    console.log('Seed skip:', e.message)
  }
}

// =====================
// START
// =====================
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✓ MongoDB terhubung')
    await seedIfEmpty()
    app.listen(PORT, () => {
      console.log(`✓ Backend wbtour berjalan di http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('✗ MongoDB gagal:', err.message)
    process.exit(1)
  })
