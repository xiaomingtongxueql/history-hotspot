export default function TopicCard({ topic, onClick }) {
  const maxCitations = topic.papers.length > 0 ? Math.max(...topic.papers.map(p => p.citations)) : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-bg-secondary rounded-card p-5 border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-ink font-semibold text-base leading-snug group-hover:text-gold transition-colors pr-3">
          {topic.title}
        </h3>
        <span className="flex-shrink-0 text-xs bg-bg-primary border border-border text-ink-muted px-2 py-0.5 rounded-full font-medium">
          {topic.papers.length} 篇
        </span>
      </div>
      <p className="text-ink-secondary text-sm leading-relaxed line-clamp-2 mb-4">{topic.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <span>最高引用</span>
          <span className="text-gold font-semibold font-serif">{maxCitations}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-ink-muted group-hover:text-gold transition-colors">
          <span>查看论文</span>
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </button>
  )
}
