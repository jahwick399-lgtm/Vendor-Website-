import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55)
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
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed top-9 left-0 right-0 z-40 transition-all duration-500"
    >
      {/* Nav container */}
      <div
        className="transition-all duration-500"
        style={scrolled ? {
          background: 'rgba(4,3,13,0.88)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(147,51,234,0.2)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(147,51,234,0.06)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #6d28d9)',
                border: '1px solid rgba(168,85,247,0.4)',
                boxShadow: '0 0 16px rgba(147,51,234,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-white font-black text-sm font-orbitron">J</span>
            </div>
            <div>
              <span className="font-orbitron font-black text-lg text-white">Jay's</span>
              <span className="font-orbitron font-black text-lg gradient-text-purple"> Vendors</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="relative text-white/45 hover:text-white font-space text-sm tracking-wide transition-colors duration-250 group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#vendors"
            className="hidden md:block btn-purple px-6 py-2.5 rounded-full text-sm tracking-wider uppercase font-orbitron"
            style={{ fontSize: '11px' }}
          >
            Get Access
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="block w-6 h-0.5 bg-current rounded-full"
                  animate={{
                    rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                    y: menuOpen && i === 0 ? 8 : menuOpen && i === 2 ? -8 : 0,
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.22 }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden md:hidden"
            style={{
              background: 'rgba(4,3,13,0.97)',
              backdropFilter: 'blur(32px)',
              borderBottom: '1px solid rgba(147,51,234,0.2)',
            }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/55 hover:text-white font-space text-base py-1 transition-colors border-b border-white/5 pb-3"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#vendors"
                onClick={() => setMenuOpen(false)}
                className="btn-purple text-center py-3.5 rounded-full text-sm tracking-wider uppercase mt-1 font-orbitron"
              >
                Get Access Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
