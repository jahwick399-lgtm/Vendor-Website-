import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TOAST_NAMES, TOAST_PRODUCTS } from '../config/vendors'

const rand = arr => arr[Math.floor(Math.random() * arr.length)]

function getTimeAgo() {
  return rand(['just now', '1 min ago', '2 mins ago', '3 mins ago', '5 mins ago', '8 mins ago'])
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #9333ea, #6d28d9)',
  'linear-gradient(135deg, #7c3aed, #4f46e5)',
  'linear-gradient(135deg, #ec4899, #9333ea)',
  'linear-gradient(135deg, #a855f7, #7c3aed)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
]

export default function PurchaseToast() {
  const [toast, setToast] = useState(null)

  const show = useCallback(() => {
    setToast({
      name: rand(TOAST_NAMES),
      product: rand(TOAST_PRODUCTS),
      time: getTimeAgo(),
      id: Date.now(),
      colorIdx: Math.floor(Math.random() * AVATAR_COLORS.length),
    })
  }, [])

  useEffect(() => {
    const first = setTimeout(show, 5500)
    let interval
    const schedule = () => {
      const delay = Math.random() * 30000 + 22000
      interval = setTimeout(() => { show(); schedule() }, delay)
    }
    const second = setTimeout(schedule, 5500)
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
          initial={{ x: -60, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -60, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-6 left-4 z-50 max-w-xs w-full sm:w-auto"
        >
          <div
            className="relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(147,51,234,0.12) 0%, rgba(6,3,16,0.97) 100%)',
              border: '1px solid rgba(147,51,234,0.28)',
              backdropFilter: 'blur(32px)',
              boxShadow: '0 0 30px rgba(147,51,234,0.2), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(147,51,234,0.7), rgba(236,72,153,0.4), transparent)',
                boxShadow: '0 0 8px rgba(147,51,234,0.5)',
              }}
            />

            {/* Avatar */}
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-bold text-sm text-white"
              style={{
                background: AVATAR_COLORS[toast.colorIdx],
                border: '1px solid rgba(168,85,247,0.35)',
                boxShadow: '0 0 12px rgba(147,51,234,0.35)',
              }}
            >
              {toast.name[0]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white/85 font-space text-sm font-semibold leading-snug">
                  {toast.name}
                </p>
                <button
                  onClick={() => setToast(null)}
                  className="shrink-0 text-white/18 hover:text-white/50 text-lg leading-none mt-0.5 transition-colors"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
              <p className="text-white/40 font-space text-xs mt-0.5">
                just purchased{' '}
                <span className="text-purple-300/90 font-semibold">{toast.product}</span>
              </p>
              <p className="text-white/18 font-space text-xs mt-1">{toast.time}</p>
            </div>

            {/* Timer drain bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                boxShadow: '0 0 6px rgba(147,51,234,0.6)',
              }}
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
