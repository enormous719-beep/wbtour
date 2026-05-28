const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '6282227227039'

/**
 * Buat link WhatsApp
 */
export function getWhatsAppLink(item) {
  if (!item || typeof item !== 'object') return '#'

  const name = item.name || item.title || 'Paket Tidak Dikenal'
  const price = item.price || 0
  const qty = item.quantity || 1
  const img = item.image || item.thumbnail || ''

  const text = `Halo, saya ingin memesan paket ini:

*${name}*
💰 Harga: Rp ${price.toLocaleString('id-ID')}
🔢 Jumlah: ${qty}
${img ? `🖼 Foto: ${img}` : ''}

Mohon informasi ketersediaan dan jadwal. Terima kasih!`

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

/**
 * Simpan pesanan ke backend lalu buka WhatsApp
 * @param {Object} params - { items: Array, customerName?, customerPhone?, note? }
 */
export async function orderViaWhatsApp({ items, customerName = '', customerPhone = '', note = '' }) {
  // Simpan ke backend (fire and forget — tidak block user)
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, customerPhone, items, note }),
    })
  } catch (e) {
    // Gagal simpan tidak menghalangi user pesan via WA
    console.warn('Gagal simpan order ke backend:', e.message)
  }

  // Buat pesan WA
  let msg = 'Halo, saya ingin memesan paket berikut:\n\n'
  items.forEach(item => {
    msg += `• *${item.title || item.name}* — Rp ${(item.price).toLocaleString('id-ID')}\n`
  })
  msg += '\nMohon informasi ketersediaan dan jadwal keberangkatan. Terima kasih!'

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
}
