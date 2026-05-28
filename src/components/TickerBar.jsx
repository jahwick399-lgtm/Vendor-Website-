import { TICKER_MESSAGES } from '../config/vendors'

const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES]

export default function TickerBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-purple-800/40 overflow-hidden h-9 flex items-center">
      {/* Purple left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-700" />

      <div className="ticker-track">
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8 text-xs font-space text-white/70"
          >
            <span>{msg}</span>
            <span className="text-purple-500 text-base">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
