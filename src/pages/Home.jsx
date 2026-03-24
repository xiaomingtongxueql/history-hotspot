import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import CategoryTabs from '../components/CategoryTabs'
import TopicCard from '../components/TopicCard'

export default function Home({ onTopicClick, searchQuery }) {
  const [data, setData] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    fetch('data/topics.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('Failed to load topics:', err))
    fetch('data/metadata.json')
      .then(r => r.json())
      .then(setMetadata)
      .catch(err => console.error('Failed to load metadata:', err))
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gold text-xl animate-pulse font-serif">加载中...</div>
      </div>
    )
  }

  // 过滤逻辑：按分类 + 搜索词
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
    <div>
      <Hero metadata={metadata} />
      <CategoryTabs
        categories={data.categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-cream/40">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">未找到"<span className="text-gold">{searchQuery}</span>"相关内容</p>
          </div>
        ) : (
          filtered.map(category => (
            <section key={category.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="font-serif text-xl text-cream font-bold">{category.name}</h2>
                <div className="flex-1 h-px bg-gold/20 ml-2" />
                <span className="text-cream/40 text-sm">{category.topics.length} 个热点</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.topics.map(topic => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    categoryColor={category.color}
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
