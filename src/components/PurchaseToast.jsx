import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TOAST_NAMES, TOAST_PRODUCTS } from '../config/vendors'

const rand = arr => arr[Math.floor(Math.random() * arr.length)]

function getTimeAgo() {
  const opts = ['just now', '1 min ago', '2 mins ago', '3 mins ago', '5 mins ago', '8 mins ago']
  return rand(opts)
}

export default function PurchaseToast() {
  const [toast, setToast] = useState(null)

  const show = useCallback(() => {
    setToast({
      name: rand(TOAST_NAMES),
      product: rand(TOAST_PRODUCTS),
      time: getTimeAgo(),
      id: Date.now(),
    })
  }, [])

  useEffect(() => {
    const first = setTimeout(show, 6000)
    let interval
    const schedule = () => {
      const delay = Math.random() * 30000 + 25000
      interval = setTimeout(() => { show(); schedule() }, delay)
    }
    const second = setTimeout(schedule, 6000)
    return () => { clearTimeout(first); clearTimeout(second); clearTimeout(interval) }
  }, [show])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5500)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          className="fixed bottom-6 left-4 z-50 max-w-xs w-full sm:w-auto"
        >
          <div
            className="relative flex items-start gap-3 p-4 rounded-2xl border border-purple-700/30 overflow-hidden"
            style={{
              background: 'rgba(8,4,18,0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(147,51,234,0.15)',
            }}
          >
            {/* Top purple line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Avatar */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border border-purple-500/30 flex items-center justify-center font-orbitron font-bold text-sm text-white">
              {toast.name[0]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white/80 font-space text-sm font-medium leading-snug">
                  {toast.name}
                </p>
                <button
                  onClick={() => setToast(null)}
                  className="shrink-0 text-white/20 hover:text-white/50 text-lg leading-none mt-0.5 transition-colors"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
              <p className="text-white/45 font-space text-xs mt-0.5">
                just purchased{' '}
                <span className="text-purple-300 font-semibold">{toast.product}</span>
              </p>
              <p className="text-white/20 font-space text-xs mt-1">{toast.time}</p>
            </div>

            {/* Timer drain bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
