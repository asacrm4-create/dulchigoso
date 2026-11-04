import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const clave = (productoId, presId) => `${productoId}:${presId}`

const almacenSeguro = createJSONStorage(() => {
  try {
    const k = '__dg'
    localStorage.setItem(k, '1')
    localStorage.removeItem(k)
    return localStorage
  } catch {
    const mem = {}
    return { getItem: (k) => mem[k] ?? null, setItem: (k, v) => (mem[k] = v), removeItem: (k) => delete mem[k] }
  }
})

export const useCarrito = create(
  persist(
    (set) => ({
      items: [],
      abierto: false,
      golpe: 0, // cambia cada vez que se agrega algo (para animar el botón)
      modo: 'menudeo',
      setModo: (modo) => set({ modo }),
      abrir: () => set({ abierto: true }),
      cerrar: () => set({ abierto: false }),
      agregar: (productoId, presId, qty = 1) =>
        set((s) => {
          const k = clave(productoId, presId)
          const existe = s.items.find((i) => i.key === k)
          const items = existe
            ? s.items.map((i) => (i.key === k ? { ...i, qty: i.qty + qty } : i))
            : [...s.items, { key: k, productoId, presId, qty }]
          return { items, golpe: s.golpe + 1 }
        }),
      setQty: (key, qty) =>
        set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      setCantidad: (productoId, presId, qty) =>
        set((s) => {
          const k = clave(productoId, presId)
          const existe = s.items.find((i) => i.key === k)
          if (qty <= 0) return { items: s.items.filter((i) => i.key !== k) }
          const items = existe ? s.items.map((i) => (i.key === k ? { ...i, qty } : i)) : [...s.items, { key: k, productoId, presId, qty }]
          return { items, golpe: qty > (existe?.qty || 0) ? s.golpe + 1 : s.golpe }
        }),
      quitar: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      vaciar: () => set({ items: [] }),
    }),
    { name: 'dulchigoso-carrito', storage: almacenSeguro, partialize: (s) => ({ items: s.items, modo: s.modo }) }
  )
)
