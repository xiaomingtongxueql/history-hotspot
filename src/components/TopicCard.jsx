export default function TopicCard({ topic, onClick, index = 0 }) {
  const maxCitations = topic.papers.length > 0 ? Math.max(...topic.papers.map(p => p.citations)) : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      {/* accent-bar: cinnabar→gold left border; card-sweep: shimmer on hover */}
      <div className="relative bg-surface rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 card-sweep accent-bar overflow-hidden">

        {/* Top section */}
        <div className="px-7 pt-7 pb-5">

          {/* Number + paper count row */}
          <div className="flex items-start justify-between mb-5">
            <span
              className="font-display leading-none font-bold text-[3.5rem] select-none transition-colors duration-500"
              style={{ color: 'rgba(139,94,10,0.10)', lineHeight: 1 }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="flex flex-col items-end gap-1 mt-1">
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink-faint">
                Papers
              </span>
              <span className="font-display text-2xl font-semibold text-ink tabular-nums leading-none">
                {topic.papers.length}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading text-[1.05rem] text-ink font-semibold leading-snug mb-3 group-hover:text-gold transition-colors duration-300 tracking-tight">
            {topic.title}
          </h3>

          {/* Description */}
          <p className="text-ink-muted text-[0.8rem] leading-relaxed line-clamp-2">
            {topic.description}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-gradient-to-r from-parchment via-gold/20 to-transparent" />

        {/* Footer */}
        <div className="px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
            <span>最高引用</span>
            <strong className="text-gold font-semibold ml-0.5">{maxCitations}</strong>
          </div>

          {/* "查看详情" — subtle always-visible, brightens on hover */}
          <span className="flex items-center gap-1 text-[11px] font-medium text-gold/40 group-hover:text-gold transition-colors duration-300">
            查看详情
            <svg className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>

      </div>
    </button>
  )
}
