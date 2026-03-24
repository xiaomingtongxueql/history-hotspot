export default function Navbar({ onSearch, onUpdate, isUpdating }) {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md">
            <span className="text-white font-serif text-lg font-bold">溯</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold text-ink tracking-tight">溯史</h1>
            <p className="text-ink-muted text-[10px] tracking-wider uppercase">History Hub</p>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative flex-1 max-w-md mx-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
          </svg>
          <input
            type="text"
            placeholder="搜索论文、作者、热点..."
            onChange={e => onSearch(e.target.value)}
            aria-label="搜索"
            className="w-full bg-bg-hover/80 border-0 rounded-xl pl-11 pr-4 py-2.5 text-sm text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:bg-white transition-all"
          />
        </div>

        {/* 更新按钮 */}
        <button
          onClick={onUpdate}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            isUpdating 
              ? 'bg-bg-hover text-ink-muted cursor-wait' 
              : 'bg-ink text-white hover:bg-ink/90 shadow-sm hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {isUpdating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>更新中...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>更新数据</span>
            </>
          )}
        </button>
      </div>
    </nav>
  )
}