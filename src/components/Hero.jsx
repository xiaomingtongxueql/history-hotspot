import { useEffect, useState } from 'react'

export default function Hero({ metadata }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const categoryCount = metadata?.totalCategories ?? 9
  const stats = [
    { label: '研究领域', value: categoryCount },
    { label: '研究热点', value: metadata?.totalTopics ?? '--' },
    { label: '收录论文', value: metadata?.totalPapers ?? '--' },
  ]

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-subtle rounded-full blur-3xl opacity-60"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-glow rounded-full blur-3xl opacity-40"/>
      </div>

      <div className="relative max-w-4xl mx-auto px-8 py-32 text-center">
        {/* Live badge */}
        <div className={`inline-flex items-center gap-2 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"/>
          </span>
          <span className="text-gold text-xs font-medium tracking-widest uppercase">每周自动更新</span>
        </div>

        {/* Main title - Museum typography */}
        <h1 className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="block font-display text-display-xl text-ink font-semibold tracking-tight">
            历史研究
          </span>
          <span className="block font-display text-display-xl text-gold font-semibold tracking-tight mt-2">
            热点导航
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`text-ink-muted text-lg md:text-xl font-light max-w-xl mx-auto mb-16 leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          汇聚{categoryCount}大史学研究领域，精选权威期刊高引用论文
        </p>

        {/* Stats */}
        <div className={`flex items-center justify-center gap-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-semibold text-ink mb-1">
                {stat.value}
              </div>
              <div className="text-ink-muted text-sm tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 text-ink-faint">
            <span className="text-xs tracking-widest uppercase">探索</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}