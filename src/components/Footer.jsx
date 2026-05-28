export default function Footer() {
  return (
    <footer className="relative border-t border-purple-900/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center border border-purple-500/30">
              <span className="text-white font-black text-sm font-orbitron">J</span>
            </div>
            <div>
              <span className="font-orbitron font-black text-lg text-white">Jay's</span>
              <span className="font-orbitron font-black text-lg gradient-text-purple"> Vendors</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#vendors" className="text-white/40 hover:text-white font-space text-sm transition-colors">Vendors</a>
            <a href="#reviews" className="text-white/40 hover:text-white font-space text-sm transition-colors">Reviews</a>
            <a href="#faq" className="text-white/40 hover:text-white font-space text-sm transition-colors">FAQ</a>
          </div>

          {/* Copyright */}
          <p className="text-white/25 font-space text-sm">
            © 2025 Jay's Vendors. All rights reserved.
          </p>
        </div>

        <div className="section-divider mt-8 mb-6" />

        <p className="text-center text-white/15 font-space text-xs max-w-2xl mx-auto leading-relaxed">
          Results may vary. Income claims are based on individual user experiences and are not guarantees of earnings.
          All products sold are digital access passes to verified supplier information.
        </p>
      </div>
    </footer>
  )
}
