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
    a: 'Absolutely. You can purchase individual categories or grab the All Access Bundle for all 7 vendors at once. The bundle saves you over $150 compared to buying each separately.',
  },
  {
    q: 'What if I have questions after buying?',
    a: 'Access includes support. If you run into any issues or have questions about getting started with your vendor, reach out and you\'ll get help.',
  },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <span className="font-space font-semibold text-white/90 group-hover:text-white transition-colors pr-4">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 w-7 h-7 rounded-full border border-purple-700/50 flex items-center justify-center text-purple-400"
        >
          <span className="text-lg leading-none font-light">+</span>
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
            <div className="px-6 pb-5 text-white/50 font-space text-sm leading-relaxed border-t border-purple-900/30 pt-4">
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
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/60 font-space text-xs tracking-widest uppercase mb-3">Got Questions</p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            FAQ
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA below FAQ */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-white/40 font-space mb-5">Still unsure? Look at the results people are getting.</p>
          <a
            href="#vendors"
            className="btn-purple px-10 py-4 rounded-full text-sm tracking-wider uppercase inline-block cta-pulse"
          >
            Get Access Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
