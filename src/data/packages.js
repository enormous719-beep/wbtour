// src/data/packages.js
export const packages = [
  {
    id: 1,
    slug: 'bali-3d2n-budget',
    title: 'Bali 3D2N Budget',
    city: 'Bali',
    days: 3,
    nights: 2,
    price: 1850000,

    thumbnail:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',

    thumbnailLarge:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop',

    highlights: ['Tanah Lot', 'Tegalalang', 'Pantai Pandawa'],

    includes: [
      'Hotel 2 malam',
      'Sarapan',
      'Mobil + driver',
      'BBM',
      'Tiket objek wisata',
    ],

    excludes: [
      'Tiket pesawat',
      'Pengeluaran pribadi',
      'Makan di luar itinerary',
    ],

    itinerary: [
      [
        'Penjemputan di Bandara',
        'Mengunjungi Tanah Lot',
        'Check-in hotel & istirahat',
      ],
      [
        'Sarapan hotel',
        'Mengunjungi Tegalalang Rice Terrace',
        'Kopi Luwak tour',
        'Kuta sunset',
      ],
      [
        'Pantai Pandawa',
        'Belanja oleh-oleh',
        'Transfer ke bandara',
      ],
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

    thumbnail:
      'https://images.unsplash.com/photo-1558981124-5c03e2b2739d?q=80&w=1600&auto=format&fit=crop',

    thumbnailLarge:
      'https://images.unsplash.com/photo-1558981124-5c03e2b2739d?q=80&w=2000&auto=format&fit=crop',

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

    thumbnail:
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',

    thumbnailLarge:
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop',

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
]

// Formatter rupiah
export function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}
