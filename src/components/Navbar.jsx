export default function Navbar({ onSearch, onUpdate, isUpdating }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-premium">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-soft">
              <span className="text-white font-display text-lg font-semibold">溯</span>
            </div>
            <span className="font-heading text-xl font-semibold text-ink tracking-tight">溯史</span>
          </div>

          {/* Search - Centered */}
          <div className="hidden md:flex flex-1 max-w-md mx-12">
            <div className="relative w-full">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
              </svg>
              <input
                type="text"
                placeholder="搜索..."
                onChange={e => onSearch(e.target.value)}
                className="w-full bg-ivory-deep/50 rounded-full pl-12 pr-6 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isUpdating 
                ? 'bg-ivory-deep text-ink-muted cursor-wait' 
                : 'bg-ink text-ivory hover:bg-ink-soft shadow-soft hover:shadow-card'
            }`}
          >
            {isUpdating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>同步中</span>
              </>
            ) : (
              <span>更新数据</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}