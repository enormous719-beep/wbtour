import { ref, computed } from 'vue'

const currentLang = ref(localStorage.getItem('wbtour-lang') || 'id')

const translations = {
    id: {
        // Navigation
        nav: {
            home: 'Beranda',
            packages: 'Paket Wisata',
            blog: 'Blog',
            about: 'Tentang',
            contact: 'Kontak',
            cart: 'Keranjang',
            admin: 'Admin'
        },

        // Home page
        home: {
            hero: {
                badge: 'Wahyu Bandung Tour',
                title: 'Jelajahi Dunia',
                titleHighlight: 'Bersama Kami',
                subtitle: 'Paket wisata terbaik dengan harga bersahabat dan pelayanan profesional untuk perjalanan tak terlupakan.',
                searchPlaceholder: 'Cari destinasi atau paket...',
                searchButton: 'Cari',
                scroll: 'Scroll'
            },
            stats: {
                customers: 'Pelanggan Puas',
                destinations: 'Destinasi',
                rating: 'Rating'
            },
            popular: {
                badge: 'Pilihan Terbaik',
                title: 'Paket Populer',
                viewAll: 'Lihat semua paket',
                from: 'Mulai',
                viewDetail: 'Lihat detail'
            },
            about: {
                badge: 'Tentang Kami',
                title: 'Partner Perjalanan',
                titleLine2: 'Terpercaya Anda',
                description1: 'adalah partner perjalanan Anda dalam mewujudkan liburan impian. Kami menyediakan berbagai pilihan paket wisata terbaik dengan harga bersahabat dan pelayanan profesional.',
                description2: 'Dengan jaringan luas dan pengalaman bertahun-tahun, kami siap membantu Anda menjelajahi keindahan dunia dengan aman dan nyaman.',
                features: {
                    price: { label: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi' },
                    guide: { label: 'Guide Berpengalaman', desc: 'Tim profesional kami' },
                    hotel: { label: 'Akomodasi Terjamin', desc: 'Hotel pilihan terbaik' },
                    support: { label: 'Layanan 24/7', desc: 'Siap membantu kapanpun' }
                },
                contactButton: 'Hubungi Kami',
                experience: 'Tahun Pengalaman'
            },
            blog: {
                badge: 'Tips & Inspirasi',
                title: 'Dari Blog Kami',
                viewAll: 'Lihat semua artikel'
            },
            cta: {
                badge: 'Siap Berangkat?',
                title: 'Rencanakan Perjalanan',
                titleLine2: 'Impian Anda Sekarang',
                subtitle: 'Konsultasikan perjalanan Anda dengan tim kami. Gratis, tanpa komitmen.',
                viewPackages: 'Lihat Semua Paket',
                chatWhatsApp: 'Chat via WhatsApp'
            }
        },

        // Calculator
        calculator: {
            title: 'Kalkulator Harga',
            description: 'Hitung estimasi biaya perjalanan Anda',
            destination: 'Pilih Destinasi',
            destinationPlaceholder: 'Pilih paket wisata',
            participants: 'Jumlah Peserta',
            participantsPlaceholder: 'Contoh: 4',
            days: 'Lama Perjalanan',
            daysPlaceholder: 'Contoh: 3',
            hotel: 'Kategori Hotel',
            budget: 'Bintang 2-3 (Budget)',
            standard: 'Bintang 3-4 (Standard)',
            premium: 'Bintang 4-5 (Premium)',
            calculate: 'Hitung Estimasi',
            result: 'Estimasi Total',
            perPerson: 'per orang',
            totalPrice: 'Total Harga',
            note: 'Catatan',
            noteText: 'Harga ini adalah estimasi. Harga final dapat berbeda tergantung tanggal, availability, dan request khusus.',
            consultation: 'Konsultasi Lebih Lanjut',
            whatsappMessage: 'Halo, saya tertarik dengan paket {package} untuk {pax} orang. Bisakah memberikan info lebih detail?'
        },

        // Common
        common: {
            loading: 'Memuat...',
            error: 'Terjadi kesalahan',
            tryAgain: 'Coba Lagi',
            close: 'Tutup',
            viewMore: 'Lihat Selengkapnya',
            indonesia: 'Indonesia'
        }
    },

    en: {
        // Navigation
        nav: {
            home: 'Home',
            packages: 'Tour Packages',
            blog: 'Blog',
            about: 'About',
            contact: 'Contact',
            cart: 'Cart',
            admin: 'Admin'
        },

        // Home page
        home: {
            hero: {
                badge: 'Wahyu Bandung Tour',
                title: 'Explore the World',
                titleHighlight: 'With Us',
                subtitle: 'Best tour packages with affordable prices and professional service for unforgettable journeys.',
                searchPlaceholder: 'Search destinations or packages...',
                searchButton: 'Search',
                scroll: 'Scroll'
            },
            stats: {
                customers: 'Happy Customers',
                destinations: 'Destinations',
                rating: 'Rating'
            },
            popular: {
                badge: 'Best Choice',
                title: 'Popular Packages',
                viewAll: 'View all packages',
                from: 'From',
                viewDetail: 'View details'
            },
            about: {
                badge: 'About Us',
                title: 'Your Trusted',
                titleLine2: 'Travel Partner',
                description1: 'is your travel partner in making your dream vacation come true. We provide various best tour package options with affordable prices and professional service.',
                description2: 'With a wide network and years of experience, we are ready to help you explore the beauty of the world safely and comfortably.',
                features: {
                    price: { label: 'Transparent Pricing', desc: 'No hidden fees' },
                    guide: { label: 'Experienced Guides', desc: 'Our professional team' },
                    hotel: { label: 'Guaranteed Accommodation', desc: 'Best hotel choices' },
                    support: { label: '24/7 Service', desc: 'Always ready to help' }
                },
                contactButton: 'Contact Us',
                experience: 'Years Experience'
            },
            blog: {
                badge: 'Tips & Inspiration',
                title: 'From Our Blog',
                viewAll: 'View all articles'
            },
            cta: {
                badge: 'Ready to Go?',
                title: 'Plan Your',
                titleLine2: 'Dream Trip Now',
                subtitle: 'Consult your trip with our team. Free, no commitment.',
                viewPackages: 'View All Packages',
                chatWhatsApp: 'Chat via WhatsApp'
            }
        },

        // Calculator
        calculator: {
            title: 'Price Calculator',
            description: 'Calculate your trip cost estimate',
            destination: 'Select Destination',
            destinationPlaceholder: 'Choose tour package',
            participants: 'Number of Participants',
            participantsPlaceholder: 'Example: 4',
            days: 'Trip Duration',
            daysPlaceholder: 'Example: 3',
            hotel: 'Hotel Category',
            budget: '2-3 Stars (Budget)',
            standard: '3-4 Stars (Standard)',
            premium: '4-5 Stars (Premium)',
            calculate: 'Calculate Estimate',
            result: 'Total Estimate',
            perPerson: 'per person',
            totalPrice: 'Total Price',
            note: 'Note',
            noteText: 'This is an estimate. Final price may vary depending on dates, availability, and special requests.',
            consultation: 'Further Consultation',
            whatsappMessage: 'Hi, I\'m interested in {package} package for {pax} people. Can you provide more details?'
        },

        // Common
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            tryAgain: 'Try Again',
            close: 'Close',
            viewMore: 'View More',
            indonesia: 'Indonesia'
        }
    }
}

export function useLanguage() {
    const setLanguage = (lang) => {
        currentLang.value = lang
        localStorage.setItem('wbtour-lang', lang)
    }

    const t = computed(() => {
        return (path) => {
            const keys = path.split('.')
            let value = translations[currentLang.value]

            for (const key of keys) {
                if (value && typeof value === 'object') {
                    value = value[key]
                } else {
                    return path // fallback
                }
            }

            return value || path
        }
    })

    return {
        currentLang,
        setLanguage,
        t: t.value,
        translations
    }
}
