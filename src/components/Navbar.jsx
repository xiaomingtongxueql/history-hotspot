export default function Navbar({ onSearch }) {
  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛</span>
          <div>
            <h1 className="font-serif text-gold text-lg font-bold leading-tight">史学研究热点</h1>
            <p className="text-cream/50 text-xs">Historical Studies Navigator</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索论文、热点..."
            onChange={e => onSearch(e.target.value)}
            className="bg-bg-secondary border border-gold/30 rounded-full px-4 py-2 text-sm text-cream placeholder-cream/40 w-64 focus:outline-none focus:border-gold/70 transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-cream/40 text-sm">🔍</span>
        </div>
      </div>
    </nav>
  )
}
