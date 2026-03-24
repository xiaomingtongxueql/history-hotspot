import { useRef, useEffect, useState } from 'react'

export default function CategoryTabs({ categories = [], activeId, onSelect }) {
  const scrollRef = useRef(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftFade(scrollLeft > 10)
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => { handleScroll() }, [])

  const tabCls = (active) =>
    active
      ? 'flex-shrink-0 relative px-5 py-2.5 text-[13px] font-semibold text-gold transition-all duration-200 whitespace-nowrap'
      : 'flex-shrink-0 relative px-5 py-2.5 text-[13px] font-medium text-ink-muted hover:text-ink transition-all duration-200 whitespace-nowrap'

  return (
    <div className="sticky top-[72px] z-40 glass border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Left fade */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none"/>
        )}

        {/* Scrollable tabs */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-0 overflow-x-auto -mx-6 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 全部 */}
          <button onClick={() => onSelect(null)} className={tabCls(activeId === null)}>
            全部
            {activeId === null && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-cinnabar to-gold" />
            )}
          </button>

          {/* Category tabs */}
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={tabCls(activeId === cat.id)}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span className="mr-1.5 text-[12px]">{cat.icon}</span>
              {cat.name}
              {activeId === cat.id && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-cinnabar to-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Right fade */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none"/>
        )}
      </div>
    </div>
  )
}
