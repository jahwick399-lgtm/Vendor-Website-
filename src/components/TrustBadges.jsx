import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const BADGES = [
  { icon: '✅', label: 'Verified Vendors',  desc: 'Every supplier is tested and confirmed',      glow: 'rgba(52,211,153,0.3)' },
  { icon: '🔒', label: 'Secure Access',     desc: 'Stripe-powered encrypted checkout',           glow: 'rgba(147,51,234,0.4)' },
  { icon: '📦', label: 'Real Products',     desc: 'Actual inventory, not drop lists',             glow: 'rgba(251,191,36,0.3)' },
  { icon: '💰', label: 'Proven Results',    desc: 'Hundreds of resellers making money',           glow: 'rgba(52,211,153,0.3)' },
  { icon: '⚡', label: 'Instant Delivery', desc: 'Access immediately after payment',             glow: 'rgba(251,191,36,0.3)' },
  { icon: '🔄', label: 'Always Updated',   desc: 'Vendors refreshed regularly',                  glow: 'rgba(147,51,234,0.4)' },
]

export default function TrustBadges() {
  return (
    <section className="relative py-20 px-4">
      <div className="section-divider mb-20 max-w-7xl mx-auto" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {BADGES.map(b => (
            <motion.div
              key={b.label}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 280, damping: 24 } }}
              className="relative text-center group cursor-default"
              style={{
                background: 'linear-gradient(145deg, rgba(147,51,234,0.07) 0%, rgba(8,4,20,0.9) 100%)',
                border: '1px solid rgba(147,51,234,0.16)',
                borderRadius: '16px',
                padding: '20px 12px',
                backdropFilter: 'blur(24px)',
                transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${b.glow} 0%, transparent 70%)`,
                  boxShadow: `0 0 30px ${b.glow}`,
                }}
              />

              <div
                className="relative text-3xl mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ filter: `drop-shadow(0 0 8px ${b.glow})` }}
              >
                {b.icon}
              </div>
              <div className="relative font-space font-bold text-white/85 text-xs mb-1 leading-snug">{b.label}</div>
              <div className="relative font-space text-white/30 text-[10px] leading-snug">{b.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider mt-20 max-w-7xl mx-auto" />
    </section>
  )
}
