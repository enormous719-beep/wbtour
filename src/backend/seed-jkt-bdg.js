const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ferdinandwahyudha800_db_user:aY9BJSFvXBiobNJJ@cluster0.zrpdqwy.mongodb.net/wbtour?appName=Cluster0'

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

const Package = mongoose.model('Package', packageSchema)

const jktBdgPackage = {
    id: 11,
    slug: "jakarta-bandung-4d3n",
    title: "Itinerary 4D3N Jakarta - Bandung",
    city: "Jakarta - Bandung",
    days: 4,
    nights: 3,
    price: 3500000,
    thumbnail: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=1600&auto=format&fit=crop",
    thumbnailLarge: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000&auto=format&fit=crop",
    highlights: [
        "Perjalanan Speed Train Jakarta-Bandung",
        "Kawah Putih Ciwidey",
        "Floating Market Lembang",
        "Great Asia Afrika",
        "The Lodge Maribaya",
        "Monas & Kota Tua Jakarta"
    ],
    includes: [
        "Hotel 3 malam (2 malam Bandung + 1 malam Jakarta)",
        "Sarapan",
        "Mobil + driver",
        "Tiket Speed Train Jakarta-Bandung",
        "Tiket wisata",
        "Makan di restoran pilihan"
    ],
    excludes: [
        "Tiket pesawat menuju Jakarta",
        "Pengeluaran pribadi",
        "Belanja factory outlet & souvenir"
    ],
    itinerary: [
        [
            "Jumpa di hotel Jakarta",
            "Menuju Bandung by Speed Train",
            "Lunch di R&R (Simpang Raya, masakan Padang)",
            "Around Bandar Bandung",
            "Jln Braga / Jln Asia Afrika",
            "Kain lace Alamoda",
            "Rumah kain sulam",
            "Dinner",
            "Check in hotel"
        ],
        [
            "Breakfast di hotel",
            "Menuju kawasan Ciwidey",
            "Kawah Putih",
            "Lunch di local resto",
            "Jembatan Rengganis",
            "Keranjang Sultan",
            "Glamping Lakeside",
            "Strawberry petik sendiri",
            "Jln Cibaduyut (kawasan barang kulit)",
            "Jln Riau (kawasan factory outlet)",
            "Dinner",
            "Kembali ke hotel"
        ],
        [
            "Breakfast di hotel",
            "Check out hotel",
            "Shopping di Pasar Baru",
            "Menuju kawasan Lembang",
            "Great Asia Afrika",
            "Lunch",
            "The Lodge Maribaya",
            "Floating Market",
            "Menuju Jakarta",
            "Dinner (Salero Jumbo, masakan Padang)",
            "Check in hotel"
        ],
        [
            "Breakfast di hotel",
            "Check out hotel",
            "Menuju Monas",
            "Kota Tua",
            "Shopping di Mangga Dua",
            "Lunch",
            "Menuju airport untuk berpulang"
        ]
    ],
    priceOptions: [
        {
            name: "2–3 Pax",
            price: 4200000
        },
        {
            name: "4–6 Pax",
            price: 3500000
        },
        {
            name: "7–10 Pax",
            price: 3000000
        }
    ]
}

async function seedPackage() {
    try {
        console.log('🔌 Connecting to MongoDB...')
        await mongoose.connect(MONGO_URI)
        console.log('✅ Connected!')

        // Check if package already exists
        const existing = await Package.findOne({ slug: jktBdgPackage.slug })
        if (existing) {
            console.log('⚠️  Package already exists! Updating...')
            await Package.findOneAndUpdate({ slug: jktBdgPackage.slug }, jktBdgPackage)
            console.log('✅ Package updated!')
        } else {
            console.log('📦 Creating new package...')
            await Package.create(jktBdgPackage)
            console.log('✅ Package created!')
        }

        console.log('\n📄 Package Details:')
        console.log('Title:', jktBdgPackage.title)
        console.log('Slug:', jktBdgPackage.slug)
        console.log('Days:', jktBdgPackage.days)
        console.log('Highlights:', jktBdgPackage.highlights.length, 'items')
        console.log('Itinerary:', jktBdgPackage.itinerary.length, 'days')

        await mongoose.disconnect()
        console.log('\n✅ Done! Package is now available in production.')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

seedPackage()
