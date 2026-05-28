import { useState } from 'react'
import { motion } from 'framer-motion'
import { VENDORS } from '../config/vendors'
import { createCheckoutSession } from '../services/api'

const EASE = [0.16, 1, 0.3, 1]

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
      <circle cx="6" cy="6" r="6" fill="rgba(147,51,234,0.25)" />
      <path d="M3 6l2 2 4-4" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function VendorCard({ vendor, index }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleBuy = async () => {
    setLoading(true)
    setError(null)
    try {
      const { url } = await createCheckoutSession(vendor.id)
      window.location.href = url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 220, damping: 28 } }}
      className={`relative glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer group ${
        vendor.featured ? 'ring-1 ring-purple-500/50' : ''
      }`}
    >
      {/* Top glow line on featured */}
      {vendor.featured && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
      )}

      {/* Header gradient area */}
      <div className={`relative bg-gradient-to-br ${vendor.gradient} p-8 flex flex-col items-center`}>
        {/* Badge */}
        {vendor.tag && (
          <div className={`absolute top-4 right-4 badge-hot bg-gradient-to-r ${vendor.tagColor} text-white px-3 py-1 rounded-full text-[10px] font-orbitron`}>
            {vendor.tag}
          </div>
        )}

        {/* Emoji icon */}
        <div
          className="text-6xl mb-4 animate-float-up"
          style={{ filter: `drop-shadow(0 0 20px ${vendor.glowColor})` }}
        >
          {vendor.emoji}
        </div>

        {/* Category tag */}
        <span className="font-space text-[10px] tracking-widest uppercase text-purple-300/60 mb-1">
          {vendor.category}
        </span>

        {/* Name */}
        <h3 className={`font-orbitron font-black text-xl text-white text-center leading-tight ${
          vendor.featured ? 'text-glow-purple' : ''
        }`}>
          {vendor.name}
        </h3>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className={`font-orbitron font-black text-4xl ${vendor.featured ? 'gradient-text-purple text-glow-purple' : 'text-white'}`}>
            {vendor.price}
          </span>
          <span className="text-white/30 font-space text-sm line-through">{vendor.originalPrice}</span>
        </div>

        {/* Description */}
        <p className="text-white/45 font-space text-sm leading-relaxed mb-5">{vendor.desc}</p>

        {/* Divider */}
        <div className="section-divider mb-5" />

        {/* What's included */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {vendor.items.map(item => (
            <li key={item} className="flex items-start gap-2.5 text-white/60 font-space text-sm">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs font-space mb-3 text-center">{error}</p>
        )}

        {/* CTA button */}
        <motion.button
          onClick={handleBuy}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold font-space tracking-widest text-sm uppercase
            relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ${
            vendor.featured
              ? 'btn-purple glow-purple'
              : 'btn-purple'
          }`}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              />
              Redirecting...
            </span>
          ) : (
            'Get Access Now →'
          )}
        </motion.button>

        {/* Trust note */}
        <p className="text-center text-white/20 font-space text-xs mt-3">
          🔒 Secure checkout · Instant access
        </p>
      </div>
    </motion.div>
  )
}

export default function VendorGrid() {
  const regular = VENDORS.filter(v => !v.featured)
  const featured = VENDORS.find(v => v.featured)

  return (
    <section id="vendors" className="relative py-28 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(147,51,234,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/60 font-space text-xs tracking-widest uppercase mb-3">
            Start Your Reselling Path
          </p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            Choose Your <span className="gradient-text">Vendor</span>
          </h2>
          <p className="mt-4 text-white/40 font-space max-w-xl mx-auto">
            Every category is a different lane. Pick one and start stacking — or grab the bundle and run every lane at once.
          </p>
        </motion.div>

        {/* Regular vendor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
          {regular.map((v, i) => (
            <VendorCard key={v.id} vendor={v} index={i} />
          ))}
        </div>

        {/* Featured all-access bundle — full width */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <AllAccessBanner vendor={featured} />
          </motion.div>
        )}

        {/* Trust bar */}
        <motion.p
          className="text-center text-white/20 font-space text-xs mt-12 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          ✅ Verified vendors &nbsp;·&nbsp; 🔒 Secure Stripe checkout &nbsp;·&nbsp; 📦 Instant delivery &nbsp;·&nbsp; 💰 Proven results
        </motion.p>
      </div>
    </section>
  )
}

function AllAccessBanner({ vendor }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleBuy = async () => {
    setLoading(true)
    setError(null)
    try {
      const { url } = await createCheckoutSession(vendor.id)
      window.location.href = url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden ring-1 ring-purple-500/50 p-8 md:p-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(147,51,234,0.08) 0%, transparent 60%)' }} />

      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 badge-hot bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-orbitron mb-4">
            🔥 BEST VALUE — SAVE $31
          </div>
          <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 30px rgba(147,51,234,0.6))' }}>
            {vendor.emoji}
          </div>
          <h3 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-3">
            {vendor.name}
          </h3>
          <p className="text-white/50 font-space leading-relaxed mb-4">{vendor.desc}</p>
          <div className="flex items-baseline gap-3">
            <span className="font-orbitron font-black text-5xl gradient-text-purple text-glow-purple">
              {vendor.price}
            </span>
            <div>
              <span className="text-white/30 font-space text-lg line-through block">{vendor.originalPrice}</span>
              <span className="text-green-400 font-space text-sm">You save $31</span>
            </div>
          </div>
        </div>

        <div>
          <ul className="grid grid-cols-2 gap-3 mb-6">
            {vendor.items.map(item => (
              <li key={item} className="flex items-start gap-2 text-white/60 font-space text-sm">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-1">
                  <circle cx="6" cy="6" r="6" fill="rgba(147,51,234,0.3)" />
                  <path d="M3 6l2 2 4-4" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {error && <p className="text-red-400 text-xs font-space mb-3">{error}</p>}

          <motion.button
            onClick={handleBuy}
            disabled={loading}
            className="w-full btn-purple py-5 rounded-xl font-bold font-space tracking-widest text-base uppercase glow-purple cta-pulse disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Redirecting...' : '🔥 Get All Access — $24.99'}
          </motion.button>
          <p className="text-center text-white/20 font-space text-xs mt-3">
            🔒 Secure checkout · Instant access to all 7 vendors
          </p>
        </div>
      </div>
    </div>
  )
}
