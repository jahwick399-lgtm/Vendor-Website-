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

// Duplicate for seamless loop
const REVIEWS = [...RAW_REVIEWS, ...RAW_REVIEWS]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < count ? 'text-yellow-400' : 'text-white/15'}`}>★</span>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const initial = review.name[0]
  return (
    <div
      className="shrink-0 w-72 glass-card rounded-2xl p-6 flex flex-col gap-4"
      style={{ minHeight: '180px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center border border-purple-500/30 font-orbitron font-bold text-sm text-white">
            {initial}
          </div>
          <div>
            <p className="font-space font-semibold text-white/90 text-sm">{review.name}</p>
            <Stars count={review.stars} />
          </div>
        </div>
        {/* Verified badge */}
        <span className="text-[10px] font-space text-purple-400/70 border border-purple-700/40 px-2 py-0.5 rounded-full">
          ✓ Verified
        </span>
      </div>

      <p className="text-white/55 font-space text-sm leading-relaxed flex-1">
        "{review.text}"
      </p>
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-14">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-purple-400/60 font-space text-xs tracking-widest uppercase mb-3">
            Real Resellers, Real Results
          </p>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white">
            What People <span className="gradient-text">Are Saying</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-white/60 font-space">4.9 / 5.0 — 200+ reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Auto-scrolling carousel — row 1 (left) */}
      <div className="relative overflow-hidden mb-4">
        <div className="reviews-track">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-[#05050a] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#05050a] to-transparent pointer-events-none z-10" />
      </div>

      {/* Row 2 — reversed direction */}
      <div className="relative overflow-hidden">
        <div className="reviews-track" style={{ animationDirection: 'reverse', animationDuration: '60s' }}>
          {[...REVIEWS].reverse().map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-[#05050a] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#05050a] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}
