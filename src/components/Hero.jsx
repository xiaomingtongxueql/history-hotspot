import { useEffect, useState } from 'react'

export default function Hero({ metadata }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const categoryCount = metadata?.totalCategories ?? 9
  const stats = [
    { value: categoryCount,                      label: '研究领域', sub: 'Research Fields' },
    { value: metadata?.totalTopics ?? '--',      label: '研究热点', sub: 'Hot Topics' },
    { value: metadata?.totalPapers ?? '--',      label: '收录论文', sub: 'Papers Indexed' },
  ]

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

      {/* 背景光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[520px] h-[520px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(196,163,90,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(184,65,54,0.12) 0%, transparent 70%)' }} />
        {/* 装饰性汉字水印 */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none"
          style={{ fontFamily: "'Noto Serif SC',serif", fontSize:'22rem', fontWeight:700, color:'#1A1814', lineHeight:1 }}>
          史
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-8 py-24 text-center">

        {/* 顶部章节标记 */}
        <div className={`flex items-center justify-center gap-3 mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold-light" />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnabar opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cinnabar" />
          </span>
          <span className="text-cinnabar text-[11px] font-semibold tracking-[0.25em] uppercase">每周自动更新</span>
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-light" />
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold-light" />
        </div>

        {/* 主标题 */}
        <h1 className="mb-6">
          <span className={`block font-display text-display-xl text-ink font-semibold tracking-tight leading-none transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            历史研究
          </span>
          <span className={`block font-display text-display-xl font-semibold tracking-tight leading-none mt-3 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ WebkitTextStroke: '1px', background: 'linear-gradient(135deg, #8B5E0A 0%, #C4A35A 50%, #8B5E0A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            热点导航
          </span>
        </h1>

        {/* 副标题 */}
        <p className={`text-ink-muted text-base md:text-lg max-w-lg mx-auto mb-14 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          汇聚{categoryCount}大史学研究领域，精选权威期刊高引用论文
        </p>

        {/* 统计数字 */}
        <div className={`flex items-stretch justify-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-stretch">
              <div className="flex flex-col items-center px-10 py-4">
                <div className="font-display text-4xl md:text-5xl font-semibold text-ink mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-ink-muted text-sm font-medium tracking-wide">{stat.label}</div>
                <div className="text-ink-faint text-[10px] tracking-widest uppercase mt-0.5">{stat.sub}</div>
              </div>
              {i < stats.length - 1 && (
                <div className="self-stretch w-px my-4 bg-gradient-to-b from-transparent via-parchment to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* 金色装饰分隔线 */}
        <div className={`mt-14 flex items-center justify-center gap-3 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-light" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold-mid" />
          <div className="text-gold-mid text-[10px] tracking-[0.3em] uppercase">Scroll to Explore</div>
          <div className="w-1.5 h-1.5 rotate-45 bg-gold-mid" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-light" />
        </div>
        <div className={`mt-3 flex justify-center transition-all duration-700 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <svg className="w-4 h-4 text-gold-light animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
