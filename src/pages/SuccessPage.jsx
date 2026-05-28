import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { verifySession } from '../services/api'

const EASE = [0.16, 1, 0.3, 1]

function CopyButton({ url }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 text-xs font-space px-2.5 py-1 rounded-lg border border-purple-700/40 text-purple-400 hover:bg-purple-900/30 transition-colors"
    >
      {copied ? '✓' : 'Copy'}
    </button>
  )
}

function VendorItem({ item }) {
  const isPlaceholder = !item.url || item.url === 'ADD_LINK_HERE'
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0 group">
      <div className="flex-1 min-w-0">
        <span className="text-white/80 font-space text-sm">{item.name}</span>
        {item.price && (
          <span className="ml-2 text-purple-400 font-space text-xs font-bold">{item.price}</span>
        )}
      </div>
      {isPlaceholder ? (
        <span className="shrink-0 text-xs font-space px-3 py-1.5 rounded-lg bg-white/5 text-white/25 border border-white/8">
          Coming Soon
        </span>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton url={item.url} />
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-space font-bold px-3 py-1.5 rounded-lg btn-purple"
          >
            Open →
          </a>
        </div>
      )}
    </div>
  )
}

function VendorSection({ section }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="glass-card rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/2 transition-colors"
      >
        <span className="font-orbitron font-bold text-sm text-white/90">{section.name}</span>
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-purple-400 text-lg leading-none"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              {section.items.map((item, i) => (
                <VendorItem key={i} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"
        />
        <p className="text-white/40 font-space text-sm">Verifying payment...</p>
      </div>
    </div>
  )
}

function ErrorScreen() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-orbitron font-black text-2xl text-white mb-3">Couldn't verify payment</h1>
        <p className="text-white/50 font-space mb-8 text-sm leading-relaxed">
          If you completed payment, your links were sent to your email. Otherwise contact support.
        </p>
        <Link to="/" className="btn-purple px-8 py-3 rounded-full text-sm tracking-wider uppercase inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!sessionId) { setStatus('error'); return }
    verifySession(sessionId)
      .then(res => {
        if (res.paid) { setData(res); setStatus('success') }
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  if (status === 'loading') return <LoadingScreen />
  if (status === 'error')   return <ErrorScreen />

  const { email, content } = data

  return (
    <div className="min-h-screen hero-bg pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
            className="text-7xl mb-5"
            style={{ filter: 'drop-shadow(0 0 30px rgba(147,51,234,0.7))' }}
          >
            🔥
          </motion.div>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl text-white mb-2">
            You're In.
          </h1>
          <p className="gradient-text font-orbitron font-black text-xl mb-4">
            {content?.title || 'Vendor Access Unlocked'}
          </p>
          {email && (
            <p className="text-white/35 font-space text-sm">
              Confirmation sent to <span className="text-purple-300">{email}</span>
            </p>
          )}
        </motion.div>

        {/* Intro */}
        {content?.intro && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="glass-card rounded-2xl p-5 mb-6 border-purple-600/30"
          >
            <p className="text-white/60 font-space text-sm leading-relaxed text-center">
              {content.intro}
            </p>
          </motion.div>
        )}

        {/* Quick start tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: '1️⃣', text: 'Click "Open" to go to the supplier' },
            { icon: '2️⃣', text: 'Buy the product at the listed price' },
            { icon: '3️⃣', text: 'Resell on eBay, FB, Depop for profit' },
          ].map(step => (
            <div key={step.text} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{step.icon}</div>
              <p className="text-white/50 font-space text-xs leading-snug">{step.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Vendor link sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-orbitron font-bold text-white text-lg">Your Vendor Links</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
            <span className="text-white/25 font-space text-xs">
              {content?.sections?.reduce((acc, s) => acc + s.items.filter(i => i.url !== 'ADD_LINK_HERE').length, 0)} links available
            </span>
          </div>

          {content?.sections?.map((section, i) => (
            <VendorSection key={i} section={section} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-10 space-y-4"
        >
          <p className="text-white/25 font-space text-xs">
            🔒 Bookmark this page — these are your links. Items marked "Coming Soon" will be added shortly.
          </p>
          <Link to="/" className="btn-outline-purple px-8 py-3 rounded-full text-sm tracking-wider uppercase inline-block">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
