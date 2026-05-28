import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-10 px-4 overflow-hidden">
      {/* Top divider with glow */}
      <div className="glow-line-h max-w-7xl mx-auto mb-12" />

      {/* Subtle background orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(147,51,234,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="FlipLabs Vendors"
              className="h-10 object-contain"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
            <div className="hidden items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9333ea, #6d28d9)', border: '1px solid rgba(168,85,247,0.4)', boxShadow: '0 0 18px rgba(147,51,234,0.4)' }}>
                <span className="text-white font-black text-sm font-orbitron">F</span>
              </div>
              <div>
                <span className="font-orbitron font-black text-lg text-white">FlipLabs</span>
                <span className="font-orbitron font-black text-lg gradient-text-purple"> Vendors</span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex items-center gap-8"
          >
            {['Vendors', 'Reviews', 'FAQ'].map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="relative text-white/35 hover:text-white/80 font-space text-sm transition-colors duration-250 group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-purple-500/60 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="text-white/22 font-space text-sm"
          >
            © 2025 FlipLabs Vendors.
          </motion.p>
        </div>

        <div className="section-divider mb-6" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-white/14 font-space text-xs max-w-2xl mx-auto leading-relaxed"
        >
          Results may vary. Income claims are based on individual user experiences and are not guarantees of earnings.
          All products sold are digital access passes to verified supplier information.
        </motion.p>
      </div>
    </footer>
  )
}
