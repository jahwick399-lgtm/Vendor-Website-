import { useState } from 'react'
import { motion } from 'framer-motion'
import { VENDORS } from '../config/vendors'
import { createCheckoutSession } from '../services/api'

const EASE = [0.16, 1, 0.3, 1]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="7" fill="rgba(147,51,234,0.22)" />
      <path d="M4 7l2.2 2.2L10 4.5" stroke="#c084fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
      const msg = err.message?.includes('fetch')
        ? 'Server starting up — wait 30 seconds and try again.'
        : err.message
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -10, transition: { type: 'spring', stiffness: 240, damping: 26 } }}
      className="relative flex flex-col cursor-pointer group card-shine"
      style={{
        background: 'linear-gradient(160deg, rgba(147,51,234,0.1) 0%, rgba(8,4,20,0.94) 45%, rgba(4,3,13,0.98) 100%)',
        border: '1px solid rgba(147,51,234,0.2)',
        borderRadius: '18px',
        overflow: 'hidden',
        backdropFilter: 'blur(28px)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      }}

    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[18px]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${vendor.glowColor} 0%, transparent 65%)`,
          boxShadow: `0 0 40px ${vendor.glowColor}, 0 0 80px rgba(147,51,234,0.15)`,
        }}
      />

      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 group-hover:opacity-100 opacity-50"
        style={{
          background: `linear-gradient(to right, transparent, ${vendor.glowColor}, transparent)`,
          boxShadow: `0 0 10px ${vendor.glowColor}`,
        }}
      />

      {/* Header gradient */}
      <div className={`relative bg-gradient-to-br ${vendor.gradient} p-7 flex flex-col items-center`}>
        {/* Badge */}
        {vendor.tag && (
          <div className={`absolute top-4 right-4 badge-hot bg-gradient-to-r ${vendor.tagColor} text-white px-3 py-1 rounded-full text-[9px] font-orbitron tracking-wider shadow-lg`}>
            {vendor.tag}
          </div>
        )}

        {/* Emoji icon */}
        <div
          className="text-5xl mb-4 animate-float-up"
          style={{ filter: `drop-shadow(0 0 24px ${vendor.glowColor})` }}
        >
          {vendor.emoji}
        </div>

        {/* Category */}
        <span className="font-space text-[9px] tracking-[0.25em] uppercase text-purple-300/50 mb-1">
          {vendor.category}
        </span>

        {/* Name */}
        <h3 className="font-orbitron font-black text-lg text-white text-center leading-tight">
          {vendor.name}
        </h3>
      </div>

      {/* Card body */}
      <div className="relative p-5 flex flex-col flex-1">
        {/* Price row */}
        <div className="flex items-baseline gap-2.5 mb-3">
          <span className="font-orbitron font-black text-4xl gradient-text-purple text-glow-sm">
            {vendor.price}
          </span>
          <span className="text-white/25 font-space text-sm line-through">{vendor.originalPrice}</span>
        </div>

        {/* Desc */}
        <p className="text-white/40 font-space text-xs leading-relaxed mb-4">{vendor.desc}</p>

        {/* Divider */}
        <div className="section-divider mb-4" />

        {/* Features */}
        <ul className="space-y-2 flex-1 mb-5">
          {vendor.items.map(item => (
            <li key={item} className="flex items-start gap-2 text-white/55 font-space text-xs">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs font-space mb-3 text-center">{error}</p>
        )}

        {/* CTA */}
        <motion.button
          onClick={handleBuy}
          disabled={loading}
          className="relative w-full py-3.5 rounded-xl font-bold font-space tracking-widest text-sm uppercase overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed btn-purple"
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
              />
              Redirecting...
            </span>
          ) : (
            'Get Access →'
          )}
        </motion.button>

        {/* Trust note */}
        <p className="text-center text-white/18 font-space text-[10px] mt-2.5 tracking-wide">
          🔒 Secure checkout · Instant delivery
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
      {/* Section background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 25%, rgba(147,51,234,0.07) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/55 font-space text-[10px] tracking-[0.3em] uppercase mb-3">
            Start Your Reselling Path
          </p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            Choose Your <span className="gradient-text">Vendor</span>
          </h2>
          <p className="mt-4 text-white/35 font-space max-w-xl mx-auto text-sm leading-relaxed">
            Every category is a different lane. Pick one and start stacking — or grab the bundle and run every lane at once.
          </p>
        </motion.div>

        {/* Regular grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
          {regular.map((v, i) => (
            <VendorCard key={v.id} vendor={v} index={i} />
          ))}
        </div>

        {/* Featured all-access — full width */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <AllAccessBanner vendor={featured} />
          </motion.div>
        )}

        {/* Trust bar */}
        <motion.p
          className="text-center text-white/18 font-space text-xs mt-10 tracking-wider"
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
      const msg = err.message?.includes('fetch')
        ? 'Server starting up — wait 30 seconds and try again.'
        : err.message
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(147,51,234,0.14) 0%, rgba(8,4,20,0.96) 40%, rgba(4,3,13,0.99) 100%)',
        border: '1px solid rgba(147,51,234,0.35)',
        backdropFilter: 'blur(32px)',
        boxShadow: '0 0 60px rgba(147,51,234,0.18), 0 0 120px rgba(147,51,234,0.08), 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Top glow line */}
      <div className="glow-line-h" />

      {/* Background orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 85% at 15% 50%, rgba(147,51,234,0.12) 0%, transparent 55%)',
        }}
      />

      <div className="relative p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left: info */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-orbitron mb-5 badge-hot"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #ec4899)',
              boxShadow: '0 0 20px rgba(147,51,234,0.5)',
            }}
          >
            🔥 BEST VALUE — SAVE $44.94
          </div>

          <div
            className="text-5xl mb-4 animate-float-up"
            style={{ filter: 'drop-shadow(0 0 35px rgba(147,51,234,0.7))' }}
          >
            {vendor.emoji}
          </div>

          <h3 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-3">
            {vendor.name}
          </h3>
          <p className="text-white/45 font-space text-sm leading-relaxed mb-5">{vendor.desc}</p>

          <div className="flex items-baseline gap-4">
            <span className="font-orbitron font-black text-5xl gradient-text-purple text-glow-purple">
              {vendor.price}
            </span>
            <div>
              <span className="text-white/25 font-space text-lg line-through block">{vendor.originalPrice}</span>
              <span className="text-emerald-400 font-space text-sm font-bold">You save $44.94</span>
            </div>
          </div>
        </div>

        {/* Right: features + CTA */}
        <div>
          <ul className="grid grid-cols-2 gap-3 mb-6">
            {vendor.items.map(item => (
              <li key={item} className="flex items-start gap-2 text-white/55 font-space text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="7" fill="rgba(147,51,234,0.25)" />
                  <path d="M4 7l2.2 2.2L10 4.5" stroke="#c084fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {error && <p className="text-red-400 text-xs font-space mb-3">{error}</p>}

          <motion.button
            onClick={handleBuy}
            disabled={loading}
            className="w-full btn-purple py-5 rounded-xl font-bold font-space tracking-widest text-base uppercase cta-pulse disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            {loading ? 'Redirecting...' : '🔥 Get All Access — $24.99 (7 Vendors)'}
          </motion.button>

          <p className="text-center text-white/18 font-space text-xs mt-3 tracking-wide">
            🔒 Secure checkout · Instant access to all 7 vendors
          </p>
        </div>
      </div>
    </div>
  )
}
