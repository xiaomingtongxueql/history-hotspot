export default function TopicCard({ topic, onClick, index = 0 }) {
  const maxCitations = topic.papers.length > 0 ? Math.max(...topic.papers.map(p => p.citations)) : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <div className="relative bg-surface rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 premium card-glow border-gradient">
        {/* Topic number - Museum style */}
        <div className="flex items-start justify-between mb-6">
          <span className="font-display text-5xl font-semibold text-ink-faint/40 group-hover:text-gold/30 transition-colors duration-500">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-ink-muted bg-ivory-deep px-3 py-1.5 rounded-full font-medium">
            {topic.papers.length} 篇论文
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl text-ink font-semibold leading-snug mb-4 group-hover:text-gold transition-colors duration-300">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-ink-muted text-sm leading-relaxed line-clamp-3 mb-8">
          {topic.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-ivory-subtle">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
            <span>最高引用 <strong className="text-gold">{maxCitations}</strong></span>
          </div>
          
          <span className="text-xs text-gold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            查看详情 →
          </span>
        </div>
      </div>
    </button>
  )
}