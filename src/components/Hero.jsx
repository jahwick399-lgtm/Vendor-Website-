import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.6 + 0.2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function LiveCounter() {
  const [count, setCount] = useState(72)

  useEffect(() => {
    const tick = setInterval(() => {
      setCount(c => {
        const delta = Math.floor(Math.random() * 7) - 3
        return Math.min(98, Math.max(54, c + delta))
      })
    }, 3500)
    return () => clearInterval(tick)
  }, [])

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-700/40 bg-purple-900/20 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
      </span>
      <span className="font-space text-sm text-white/80">
        <span className="font-bold text-white tabular-nums">{count}</span> live viewers
      </span>
    </div>
  )
}

const STATS = [
  { value: '10K+', label: 'Resellers' },
  { value: '$500+', label: 'Avg First Month' },
  { value: '4.9★', label: 'Rating' },
  { value: '7', label: 'Vendor Categories' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-bg flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      <Particles />

      {/* Top glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, rgba(147,51,234,0.15) 0%, transparent 70%)' }} />

      <div className="relative text-center max-w-5xl mx-auto" style={{ zIndex: 2 }}>
        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="flex justify-center mb-8"
        >
          <LiveCounter />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.35, ease: EASE }}
        >
          <h1 className="font-orbitron font-black leading-none tracking-tight">
            <span className="block text-[clamp(2.5rem,8vw,6rem)] text-white">
              The Vendors
            </span>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] gradient-text">
              Everyone's Talking About
            </span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-6 text-lg md:text-xl text-white/50 font-space max-w-xl mx-auto leading-relaxed"
        >
          Trusted by hundreds of resellers.{' '}
          <span className="text-white/80">Real products. Real profit.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#vendors"
            className="btn-purple px-10 py-4 rounded-full text-base tracking-wider uppercase cta-pulse w-full sm:w-auto"
          >
            Get Access Now
          </a>
          <a
            href="#reviews"
            className="btn-outline-purple px-8 py-4 rounded-full text-sm tracking-wider uppercase w-full sm:w-auto"
          >
            See What People Say
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
            >
              <div className="font-orbitron font-black text-2xl md:text-3xl gradient-text-purple text-glow-purple">
                {s.value}
              </div>
              <div className="text-white/35 font-space text-xs tracking-widest uppercase mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-white/20 font-space text-xs tracking-widest uppercase">Scroll</div>
          <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
