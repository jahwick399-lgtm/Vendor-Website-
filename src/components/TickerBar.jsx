import { TICKER_MESSAGES } from '../config/vendors'

const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES]

export default function TickerBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden h-9 flex items-center"
      style={{
        background: 'linear-gradient(90deg, rgba(4,3,13,0.97), rgba(8,4,20,0.97))',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(147,51,234,0.2)',
        boxShadow: '0 1px 20px rgba(147,51,234,0.12)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{
          background: 'linear-gradient(to bottom, #a855f7, #ec4899, #7e22ce)',
          boxShadow: '0 0 8px rgba(168,85,247,0.7)',
        }}
      />

      <div className="ticker-track">
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8 text-[11px] font-space"
            style={{ color: 'rgba(255,255,255,0.62)' }}
          >
            <span>{msg}</span>
            <span style={{ color: '#9333ea', fontSize: '10px', opacity: 0.7 }}>◆</span>
          </span>
        ))}
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#04030d] to-transparent pointer-events-none" />
    </div>
  )
}
