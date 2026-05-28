import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Vendors', href: '#vendors' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-9 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-2xl border-b border-purple-900/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center glow-purple-sm border border-purple-500/30">
            <span className="text-white font-black text-sm font-orbitron">J</span>
          </div>
          <div>
            <span className="font-orbitron font-black text-lg text-white">Jay's</span>
            <span className="font-orbitron font-black text-lg gradient-text-purple"> Vendors</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="text-white/50 hover:text-white font-space text-sm tracking-wide transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#vendors"
          className="hidden md:block btn-purple px-6 py-2.5 rounded-full text-sm tracking-wider uppercase cta-pulse"
        >
          Get Access
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="block w-6 h-0.5 bg-current rounded"
                animate={{
                  rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y: menuOpen && i === 0 ? 8 : menuOpen && i === 2 ? -8 : 0,
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-purple-900/30"
        >
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white font-space text-base py-1 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#vendors"
              onClick={() => setMenuOpen(false)}
              className="btn-purple text-center py-3 rounded-full text-sm tracking-wider uppercase mt-2"
            >
              Get Access Now
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
