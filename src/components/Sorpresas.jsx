import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Monstruo from './Monstruo'

// Easter eggs del monstruo:
//  1. Escribir "chamoy" en cualquier parte → el monstruo sube desde abajo y da una mordida.
//  2. 5 clics al logo → caen monstruos-gomita en la bolsa del inicio (lo maneja la escena 3D).
//  3. Si cambias de pestaña, el título te extraña.
//  4. Un saludo en la consola para curiosos.
export default function Sorpresas() {
  const [visto, setVisto] = useState(false)

  useEffect(() => {
    let buffer = ''
    const tecla = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-6)
      if (buffer === 'chamoy') {
        setVisto(true)
        setTimeout(() => setVisto(false), 2600)
      }
    }
    window.addEventListener('keydown', tecla)

    const original = document.title
    const vis = () => {
      document.title = document.hidden ? 'Te guardé unas gomitas · Dulchigoso' : original
    }
    document.addEventListener('visibilitychange', vis)

    console.log(
      '%c dulchigoso %c picositos y aciditos. Escribe "chamoy" en la página 👀',
      'background:#E08B50;color:#fff;font:700 14px sans-serif;padding:4px 8px;border-radius:6px 0 0 6px',
      'background:#B3364E;color:#fff;font:14px sans-serif;padding:4px 8px;border-radius:0 6px 6px 0'
    )

    const sorpresa = (e) => {
      if (e.detail === 'asomo') {
        setVisto(true)
        setTimeout(() => setVisto(false), 2600)
      }
    }
    window.addEventListener('dulchigoso:sorpresa', sorpresa)
    return () => {
      window.removeEventListener('keydown', tecla)
      document.removeEventListener('visibilitychange', vis)
      window.removeEventListener('dulchigoso:sorpresa', sorpresa)
    }
  }, [])

  return (
    <AnimatePresence>
      {visto && (
        <motion.div
          className="sorpresa"
          initial={{ y: '100%' }}
          animate={{ y: '18%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          aria-hidden="true"
        >
          <Monstruo mirar className="sorpresa__monstruo" />
          <span className="sorpresa__texto">¡Ñam! Picosito.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
