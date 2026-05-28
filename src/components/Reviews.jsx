import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const RAW_REVIEWS = [
  { text: "Vendor lowkey crazy, made 3k my first couple weeks 😭", name: "Jordan M.", stars: 5 },
  { text: "Been using this vendor for a minute now and results been wild", name: "Tyler K.", stars: 5 },
  { text: "Got the vendor and already made my money back fast", name: "Marcus J.", stars: 5 },
  { text: "I ain't even expect this to work that good ngl", name: "Kai B.", stars: 5 },
  { text: "Copped the iPhone vendor and flipped my first order quick", name: "Jayden R.", stars: 5 },
  { text: "Thought people was overhyping it till I tried it myself 😂", name: "Alex T.", stars: 5 },
  { text: "I've been eating off these vendors for a while now", name: "Ryan S.", stars: 5 },
  { text: "I only started wit $50 and kept running it up", name: "Noah D.", stars: 5 },
  { text: "Wish I found this sooner ngl", name: "Ethan W.", stars: 5 },
  { text: "First week using it and I already seen progress", name: "Liam F.", stars: 5 },
  { text: "Almost ain't buy it but I'm glad I did", name: "Zoe C.", stars: 5 },
  { text: "My bro put me onto this sh** works wonders 😭", name: "Maya L.", stars: 5 },
  { text: "Been consistent with it and it's been paying off ngl", name: "Andre P.", stars: 5 },
  { text: "I was skeptical at first but I see why people talk about it now 😂", name: "DeShawn H.", stars: 5 },
  { text: "Lowkey one of the best investments I've made this year", name: "Chris V.", stars: 5 },
]

const REVIEWS = [...RAW_REVIEWS, ...RAW_REVIEWS]

const AVATAR_COLORS = [
  'linear-gradient(135deg, #9333ea, #6d28d9)',
  'linear-gradient(135deg, #7c3aed, #4f46e5)',
  'linear-gradient(135deg, #a855f7, #9333ea)',
  'linear-gradient(135deg, #ec4899, #9333ea)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-sm"
          style={{
            color: i < count ? '#fbbf24' : 'rgba(255,255,255,0.1)',
            textShadow: i < count ? '0 0 8px rgba(251,191,36,0.6)' : 'none',
          }}
        >★</span>
      ))}
    </div>
  )
}

function ReviewCard({ review, colorIdx }) {
  const initial = review.name[0]
  return (
    <div
      className="shrink-0 w-72 flex flex-col gap-4 transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, rgba(147,51,234,0.08) 0%, rgba(8,4,20,0.92) 60%, rgba(4,3,13,0.96) 100%)',
        border: '1px solid rgba(147,51,234,0.16)',
        borderRadius: '16px',
        padding: '20px',
        minHeight: '175px',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm text-white shrink-0"
            style={{
              background: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length],
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 12px rgba(147,51,234,0.3)',
            }}
          >
            {initial}
          </div>
          <div>
            <p className="font-space font-semibold text-white/90 text-sm">{review.name}</p>
            <Stars count={review.stars} />
          </div>
        </div>
        <span
          className="text-[9px] font-space text-purple-400/65 px-2 py-0.5 rounded-full"
          style={{ border: '1px solid rgba(147,51,234,0.25)' }}
        >
          ✓ Verified
        </span>
      </div>

      <p className="text-white/50 font-space text-sm leading-relaxed flex-1">
        "{review.text}"
      </p>
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(147,51,234,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 mb-14">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/55 font-space text-[10px] tracking-[0.3em] uppercase mb-3">
            Real Resellers, Real Results
          </p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            What People <span className="gradient-text">Are Saying</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl" style={{ color: '#fbbf24', textShadow: '0 0 10px rgba(251,191,36,0.6)' }}>★</span>
              ))}
            </div>
            <span className="text-white/50 font-space text-sm">4.9 / 5.0 — 200+ verified reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Row 1 — left scroll */}
      <div className="relative overflow-hidden mb-4">
        <div className="reviews-track">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={i} review={r} colorIdx={i} />
          ))}
        </div>
        <div className="absolute top-0 left-0 bottom-0 w-28 bg-gradient-to-r from-[#04030d] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-28 bg-gradient-to-l from-[#04030d] to-transparent pointer-events-none z-10" />
      </div>

      {/* Row 2 — reverse */}
      <div className="relative overflow-hidden">
        <div className="reviews-track" style={{ animationDirection: 'reverse', animationDuration: '72s' }}>
          {[...REVIEWS].reverse().map((r, i) => (
            <ReviewCard key={i} review={r} colorIdx={i + 3} />
          ))}
        </div>
        <div className="absolute top-0 left-0 bottom-0 w-28 bg-gradient-to-r from-[#04030d] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-28 bg-gradient-to-l from-[#04030d] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}
