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

  useEffect(() => {
    handleScroll()
  }, [])

  return (
    <div className="sticky top-[73px] z-40 glass border-b border-border/30">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 左侧渐变 */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-primary/95 to-transparent z-10 pointer-events-none"/>
        )}
        
        {/* 标签滚动区 */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto py-4 -mx-6 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 全部按钮 */}
          <button
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out ${
              activeId === null
                ? 'bg-ink text-white shadow-md'
                : 'bg-transparent text-ink-secondary hover:bg-bg-hover hover:text-ink'
            }`}
          >
            全部
          </button>

          {/* 分类按钮 */}
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out whitespace-nowrap ${
                activeId === cat.id
                  ? 'bg-ink text-white shadow-md'
                  : 'bg-transparent text-ink-secondary hover:bg-bg-hover hover:text-ink'
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 右侧渐变 */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-primary/95 to-transparent z-10 pointer-events-none"/>
        )}
      </div>
    </div>
  )
}