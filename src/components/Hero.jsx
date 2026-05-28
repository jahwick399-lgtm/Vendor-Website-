import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const PARTICLE_DATA = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,
  left: Math.random() * 100,
  duration: Math.random() * 10 + 7,
  delay: Math.random() * 14,
  opacity: Math.random() * 0.5 + 0.2,
  color: i % 3 === 0
    ? 'rgba(236,72,153,0.8)'
    : i % 3 === 1
    ? 'rgba(147,51,234,0.8)'
    : 'rgba(168,85,247,0.7)',
}))

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLE_DATA.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Primary top orb */}
      <div
        className="orb-float absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(147,51,234,0.22) 0%, rgba(147,51,234,0.06) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Right orb */}
      <div
        className="orb-float-alt absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: '25%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(126,34,206,0.06) 55%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Left orb */}
      <div
        className="orb-float absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: '45%',
          left: '-8%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(147,51,234,0.06) 55%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '3s',
        }}
      />
      {/* Bottom center orb */}
      <div
        className="orb-float-alt absolute rounded-full"
        style={{
          width: 600,
          height: 300,
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '5s',
        }}
      />
    </div>
  )
}

function LiveCounter() {
  const [count, setCount] = useState(72)

  useEffect(() => {
    const tick = setInterval(() => {
      setCount(c => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.min(99, Math.max(55, c + delta))
      })
    }, 3800)
    return () => clearInterval(tick)
  }, [])

  return (
    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-600/30 bg-purple-950/40 backdrop-blur-md"
         style={{ boxShadow: '0 0 20px rgba(147,51,234,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
      </span>
      <span className="font-space text-sm text-white/75">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-white tabular-nums"
        >
          {count}
        </motion.span>
        {' '}live viewers
      </span>
    </div>
  )
}

const STATS = [
  { value: '10K+',  label: 'Resellers',       icon: '👥' },
  { value: '$500+', label: 'Avg First Month',  icon: '💰' },
  { value: '4.9★',  label: 'Rating',           icon: '⭐' },
  { value: '7',     label: 'Vendor Categories',icon: '🏪' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-bg mesh-grid flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
      <Particles />
      <FloatingOrbs />

      <div className="relative text-center max-w-5xl mx-auto" style={{ zIndex: 2 }}>

        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="flex justify-center mb-7"
        >
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-space"
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(236,72,153,0.1))',
              border: '1px solid rgba(147,51,234,0.35)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 24px rgba(147,51,234,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-base">🔥</span>
            <span className="text-purple-200/80">The most trusted vendor list in the game</span>
            <span className="text-purple-400/60">→</span>
          </div>
        </motion.div>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="flex justify-center mb-9"
        >
          <LiveCounter />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.38, ease: EASE }}
        >
          <h1 className="font-orbitron font-black leading-[0.95] tracking-tight">
            <span className="block text-[clamp(2.8rem,9vw,7rem)] text-white"
                  style={{ textShadow: '0 0 80px rgba(255,255,255,0.05)' }}>
              The Vendors
            </span>
            <span className="block text-[clamp(2.8rem,9vw,7rem)] gradient-text">
              Everyone's Talking About
            </span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-7 text-lg md:text-xl text-white/45 font-space max-w-lg mx-auto leading-relaxed"
        >
          Trusted by thousands of resellers.{' '}
          <span className="text-white/80 font-medium">Real products. Real profit. Real fast.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#vendors"
            className="btn-purple px-12 py-4 rounded-full text-base tracking-widest uppercase cta-pulse w-full sm:w-auto font-orbitron"
          >
            Get Access Now
          </a>
          <a
            href="#reviews"
            className="btn-outline-purple px-9 py-4 rounded-full text-sm tracking-wider uppercase w-full sm:w-auto"
          >
            See Real Results →
          </a>
        </motion.div>

        {/* Trust micro-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-5 text-white/20 font-space text-xs tracking-wide"
        >
          🔒 Secure Stripe checkout &nbsp;·&nbsp; ⚡ Instant access after payment
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-2xl mx-auto"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 + i * 0.08 }}
              className="relative text-center group"
            >
              <div
                className="rounded-2xl py-5 px-3 transition-all duration-400"
                style={{
                  background: 'linear-gradient(145deg, rgba(147,51,234,0.07), rgba(4,3,13,0.8))',
                  border: '1px solid rgba(147,51,234,0.14)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(147,51,234,0.4)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(147,51,234,0.2), 0 8px 32px rgba(0,0,0,0.4)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(147,51,234,0.14)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-orbitron font-black text-2xl md:text-3xl gradient-text-purple text-glow-sm">
                  {s.value}
                </div>
                <div className="text-white/30 font-space text-[11px] tracking-widest uppercase mt-1.5">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
      >
        <div className="text-white/18 font-space text-[10px] tracking-[0.25em] uppercase">Scroll</div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <div className="w-px h-10 bg-gradient-to-b from-purple-500/50 via-purple-400/20 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-0.5"
               style={{ boxShadow: '0 0 6px rgba(168,85,247,0.7)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
