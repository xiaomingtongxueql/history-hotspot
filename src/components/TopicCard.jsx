export default function TopicCard({ topic, onClick, index = 0 }) {
  const maxCitations = topic.papers.length > 0 ? Math.max(...topic.papers.map(p => p.citations)) : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left group animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative bg-white rounded-2xl p-6 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-gold/30">
        {/* 左侧装饰线 */}
        <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-gold/60 via-gold to-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        
        {/* 内容 */}
        <div className="pl-0 group-hover:pl-3 transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-serif text-ink font-semibold text-base leading-snug group-hover:text-gold transition-colors duration-200 flex-1 pr-4">
              {topic.title}
            </h3>
            <span className="flex-shrink-0 bg-bg-hover text-ink-secondary text-xs px-3 py-1 rounded-full font-medium border border-border/50 group-hover:bg-gold-subtle group-hover:text-gold group-hover:border-gold/20 transition-all duration-200">
              {topic.papers.length} 篇
            </span>
          </div>

          <p className="text-ink-secondary text-sm leading-relaxed line-clamp-2 mb-5">{topic.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
                <span>引用</span>
                <span className="text-gold font-semibold font-serif">{maxCitations}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-ink-muted group-hover:text-gold transition-colors duration-200">
              <span>查看详情</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}