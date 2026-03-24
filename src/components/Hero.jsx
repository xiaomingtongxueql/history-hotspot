export default function Hero({ metadata }) {
  return (
    <div className="relative overflow-hidden bg-bg-secondary py-16 px-6">
      {/* 网格装饰背景 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      <div className="max-w-7xl mx-auto relative text-center">
        <p className="text-gold/70 text-sm font-sans tracking-widest mb-3">HISTORICAL RESEARCH NAVIGATOR</p>
        <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4 leading-tight">史学研究热点导航</h2>
        <p className="text-cream/60 text-lg mb-10 max-w-2xl mx-auto">汇聚十五大史学研究领域，精选高引用、高下载权威论文，助力学术研究</p>
        <div className="flex justify-center gap-12">
          {[
            { label: '研究热点', value: metadata?.totalTopics ?? '--' },
            { label: '收录论文', value: metadata?.totalPapers ?? '--' },
            { label: '最近更新', value: metadata?.lastUpdated ?? '--' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gold font-serif">{stat.value}</div>
              <div className="text-cream/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
