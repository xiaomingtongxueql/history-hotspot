export default function TopicCard({ topic, categoryColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-bg-secondary rounded-lg p-5 border border-gold/10 hover:border-gold/50 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-cream font-semibold text-base leading-snug group-hover:text-gold transition-colors">
          {topic.title}
        </h3>
        <span className="flex-shrink-0 ml-3 text-xs bg-bg-primary border border-gold/30 text-gold/70 px-2 py-0.5 rounded-full">
          {topic.papers.length} 篇
        </span>
      </div>
      <p className="text-cream/50 text-sm leading-relaxed line-clamp-2">{topic.description}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-cream/40">
        <span>最高引用</span>
        <span className="text-gold font-bold">{Math.max(...topic.papers.map(p => p.citations))}</span>
        <span className="mx-1">·</span>
        <span>查看论文 →</span>
      </div>
    </button>
  )
}
