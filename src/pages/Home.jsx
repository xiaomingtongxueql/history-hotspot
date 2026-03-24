import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import CategoryTabs from '../components/CategoryTabs'
import TopicCard from '../components/TopicCard'

export default function Home({ onTopicClick, searchQuery }) {
  const [data, setData] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const controller = new AbortController()
    const { signal } = controller

    fetch('data/topics.json', { signal })
      .then(r => r.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load topics:', err)
          setError('数据加载失败，请刷新页面重试')
        }
      })

    fetch('data/metadata.json', { signal })
      .then(r => r.json())
      .then(setMetadata)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load metadata:', err)
        }
      })

    return () => controller.abort()
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <p className="text-ink-secondary text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-all active:scale-[0.98]"
        >
          刷新页面
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold-subtle flex items-center justify-center animate-pulse">
          <span className="text-gold font-heading text-xl">溯</span>
        </div>
        <p className="text-ink-muted text-sm animate-pulse">正在加载数据...</p>
      </div>
    )
  }

  // 过滤逻辑
  const filtered = data.categories
    .filter(cat => !activeCategory || cat.id === activeCategory)
    .map(cat => ({
      ...cat,
      topics: cat.topics.filter(t =>
        !searchQuery ||
        t.title.includes(searchQuery) ||
        t.description.includes(searchQuery) ||
        t.papers.some(p =>
          p.title.includes(searchQuery) ||
          p.authors.some(a => a.includes(searchQuery))
        )
      )
    }))
    .filter(cat => cat.topics.length > 0)

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Hero metadata={metadata} />
      <CategoryTabs
        categories={data.categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      
      <div className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-bg-hover flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
              </svg>
            </div>
            <p className="text-ink-secondary text-lg mb-2">未找到相关内容</p>
            <p className="text-ink-muted text-sm">尝试搜索其他关键词或清除筛选条件</p>
          </div>
        ) : (
          filtered.map((category, catIndex) => (
            <section key={category.id} className="mb-16 animate-slide-up" style={{ animationDelay: `${catIndex * 100}ms` }}>
              {/* 分类标题 */}
              <div className="flex items-center gap-3 mb-8">
                {/* Cinnabar seal dot */}
                <span className="seal-dot flex-shrink-0" />
                {/* Category icon */}
                <span className="text-lg leading-none select-none">{category.icon}</span>
                {/* Title */}
                <h2 className="font-heading text-xl text-ink font-semibold tracking-tight">{category.name}</h2>
                {/* Gold rule */}
                <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-parchment to-transparent" />
                {/* Count badge */}
                <span className="text-[11px] font-semibold tracking-[0.08em] text-gold bg-gold-subtle border border-gold/10 px-3 py-1 rounded-full">
                  {category.topics.length} 个热点
                </span>
              </div>

              {/* 卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.topics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onClick={() => onTopicClick(topic, category)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}