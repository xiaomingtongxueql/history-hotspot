export default function Navbar({ onSearch }) {
  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-light flex items-center justify-center">
            <span className="text-gold text-sm">史</span>
          </div>
          <div>
            <h1 className="font-serif text-base font-semibold text-ink leading-tight">史学研究热点</h1>
            <p className="text-ink-muted text-[10px] tracking-widest uppercase">Historical Studies</p>
          </div>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
          </svg>
          <input
            type="text"
            placeholder="搜索论文、热点..."
            onChange={e => onSearch(e.target.value)}
            aria-label="搜索论文、热点"
            className="bg-bg-hover border border-border rounded-full pl-9 pr-4 py-2 text-sm text-ink placeholder-ink-muted w-56 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
          />
        </div>
      </div>
    </nav>
  )
}
