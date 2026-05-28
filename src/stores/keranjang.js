// src/stores/keranjang.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('keranjang', {
  state: () => ({
    items: []
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  },

  actions: {
    addToCart(pkg) {
      // pkg: object dari packages.js
      const existing = this.items.find((item) => item.id === pkg.id)

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: pkg.id,
          slug: pkg.slug,
          title: pkg.title,
          city: pkg.city,
          days: pkg.days,
          nights: pkg.nights,
          price: pkg.price,
          thumbnail: pkg.thumbnail,   // ambil dari data paket
          quantity: 1
        })
      }
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
    },

    clearCart() {
      this.items = []
    }
  }
})
