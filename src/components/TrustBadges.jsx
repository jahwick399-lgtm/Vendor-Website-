import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const BADGES = [
  { icon: '✅', label: 'Verified Vendors', desc: 'Every supplier is tested and confirmed' },
  { icon: '🔒', label: 'Secure Access', desc: 'Stripe-powered encrypted checkout' },
  { icon: '📦', label: 'Real Products', desc: 'Actual inventory, not drop lists' },
  { icon: '💰', label: 'Proven Results', desc: 'Hundreds of resellers making money' },
  { icon: '⚡', label: 'Instant Delivery', desc: 'Access immediately after payment' },
  { icon: '🔄', label: 'Always Updated', desc: 'Vendors refreshed regularly' },
]

export default function TrustBadges() {
  return (
    <section className="relative py-20 px-4">
      <div className="section-divider mb-20 max-w-7xl mx-auto" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {BADGES.map(b => (
            <motion.div
              key={b.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="glass-card rounded-2xl p-5 text-center group hover:glow-purple-sm transition-all duration-300"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <div className="font-space font-bold text-white/90 text-sm mb-1 leading-tight">{b.label}</div>
              <div className="font-space text-white/35 text-xs leading-snug">{b.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider mt-20 max-w-7xl mx-auto" />
    </section>
  )
}
