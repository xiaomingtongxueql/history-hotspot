import { useEffect, useState } from 'react'

export default function Hero({ metadata }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { label: '研究热点', value: metadata?.totalTopics ?? '--', suffix: '' },
    { label: '收录论文', value: metadata?.totalPapers ?? '--', suffix: '' },
    { label: '更新日期', value: metadata?.lastUpdated?.slice(5) ?? '--', suffix: '' },
  ]

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-bg-primary">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"/>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold/3 rounded-full blur-2xl"/>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 bg-gold-subtle border border-gold/20 text-gold text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            每周一自动更新
          </div>

          {/* 大标题 */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink font-bold leading-[1.1] mb-6 tracking-tight">
            历史研究
            <br />
            <span className="text-gold">热点导航</span>
          </h1>

          {/* 副标题 */}
          <p className="text-ink-secondary text-lg md:text-xl leading-relaxed max-w-xl mb-12">
            汇聚十五大史学研究领域，精选权威期刊高引用论文，为历史学研究者提供一站式学术资源导航。
          </p>

          {/* 统计数据 */}
          <div className="flex items-center gap-10">
            {stats.map((stat, i) => (
              <div 
                key={stat.label} 
                className={`transition-all duration-500 delay-${(i + 1) * 100}`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-serif font-bold text-ink">{stat.value}</span>
                  {stat.suffix && <span className="text-ink-muted text-sm">{stat.suffix}</span>}
                </div>
                <div className="text-ink-muted text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}