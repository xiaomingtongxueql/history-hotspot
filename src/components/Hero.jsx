export default function Hero({ metadata }) {
  return (
    <div className="bg-bg-primary border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gold-light text-gold text-xs font-medium px-3 py-1.5 rounded-full mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
            每周自动更新
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-ink font-bold leading-tight mb-4">
            史学研究<br/>热点导航
          </h2>
          <p className="text-ink-secondary text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            汇聚十五大史学研究领域，精选权威期刊高引用论文，助力学术研究。
          </p>
          <div className="flex items-center gap-8">
            {[
              { label: '研究热点', value: metadata?.totalTopics ?? '--' },
              { label: '收录论文', value: metadata?.totalPapers ?? '--' },
              { label: '更新日期', value: metadata?.lastUpdated ?? '--' },
            ].map((stat, i) => (
              <div key={stat.label}>
                {i > 0 && <div className="hidden"/>}
                <div className="text-2xl font-serif font-bold text-ink">{stat.value}</div>
                <div className="text-ink-muted text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
