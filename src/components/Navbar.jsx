export default function Navbar({ onSearch, onUpdate, isUpdating }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-premium">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-soft"
              style={{ background: 'linear-gradient(135deg, #8B5E0A 0%, #C4A35A 100%)' }}
            >
              <span className="text-white font-display text-base font-bold" style={{ fontFamily: "'Noto Serif SC',serif" }}>溯</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-[0.95rem] font-semibold text-ink tracking-tight">历史研究热点</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-ink-faint mt-0.5">History Research</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
              </svg>
              <input
                type="text"
                placeholder="搜索论文、作者、期刊…"
                onChange={e => onSearch(e.target.value)}
                className="w-full bg-ivory-deep/60 rounded-full pl-10 pr-5 py-2 text-[13px] text-ink placeholder-ink-faint focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide transition-all duration-300 ${
              isUpdating
                ? 'bg-ivory-deep text-ink-muted cursor-wait'
                : 'bg-ink text-white hover:bg-gold shadow-soft hover:shadow-gold-glow'
            }`}
          >
            {isUpdating ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>同步中</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>更新数据</span>
              </>
            )}
          </button>

        </div>
      </div>
    </nav>
  )
}
