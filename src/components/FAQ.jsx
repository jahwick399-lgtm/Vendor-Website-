import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const FAQS = [
  {
    q: 'What exactly is a vendor?',
    a: "A vendor is a direct supplier — a trusted source where you can buy products at wholesale prices and resell them for profit. You're getting access to the same suppliers that experienced resellers use to make consistent income.",
  },
  {
    q: 'Is this legit?',
    a: 'Yes. These are real suppliers used by active resellers right now. Every vendor is tested before being listed. Hundreds of people have already made money using these exact sources.',
  },
  {
    q: 'How fast can I make money?',
    a: "Depends on your effort and starting budget. Many buyers see their first flip within days of getting started. Some have made back their investment the same week. The vendor does the heavy lifting — you just need to move product.",
  },
  {
    q: 'What do I need to start?',
    a: "A small starting budget and the vendor link. That's it. No special skills, no experience, no inventory required upfront. Buy one item, flip it, repeat. Start small and scale.",
  },
  {
    q: 'What do I get after I pay?',
    a: "Instant access to your vendor. You'll be redirected immediately after checkout with all the supplier information you need — links, pricing tiers, and how to place your first order.",
  },
  {
    q: 'Can I get multiple vendors?',
    a: 'Absolutely. You can purchase individual categories or grab the All Access Bundle for all 7 vendors at once. The bundle saves you over $44 compared to buying each separately.',
  },
  {
    q: 'What if I have questions after buying?',
    a: "Access includes support. If you run into any issues or have questions about getting started with your vendor, reach out and you'll get help.",
  },
]

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: EASE }}
      className="overflow-hidden"
      style={{
        background: isOpen
          ? 'linear-gradient(145deg, rgba(147,51,234,0.1) 0%, rgba(8,4,20,0.95) 100%)'
          : 'linear-gradient(145deg, rgba(147,51,234,0.06) 0%, rgba(8,4,20,0.9) 100%)',
        border: `1px solid ${isOpen ? 'rgba(147,51,234,0.35)' : 'rgba(147,51,234,0.14)'}`,
        borderRadius: '14px',
        transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isOpen ? '0 0 30px rgba(147,51,234,0.12), 0 8px 32px rgba(0,0,0,0.35)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <span className="font-space font-semibold text-white/85 group-hover:text-white transition-colors duration-200 pr-4 text-sm md:text-base">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            border: `1px solid ${isOpen ? 'rgba(168,85,247,0.6)' : 'rgba(147,51,234,0.3)'}`,
            background: isOpen ? 'rgba(147,51,234,0.2)' : 'transparent',
            boxShadow: isOpen ? '0 0 12px rgba(147,51,234,0.4)' : 'none',
            color: isOpen ? '#c084fc' : '#9333ea',
          }}
        >
          <span className="text-xl leading-none font-light mt-px">+</span>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-5 text-white/45 font-space text-sm leading-relaxed pt-3"
              style={{ borderTop: '1px solid rgba(147,51,234,0.14)' }}
            >
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="relative py-28 px-4">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 70%, rgba(147,51,234,0.06) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/55 font-space text-[10px] tracking-[0.3em] uppercase mb-3">Got Questions</p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-white/35 font-space mb-6 text-sm">Still unsure? Look at the results people are getting.</p>
          <a
            href="#vendors"
            className="btn-purple px-12 py-4 rounded-full text-sm tracking-wider uppercase inline-block cta-pulse font-orbitron"
            style={{ fontSize: '11px' }}
          >
            Get Access Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
