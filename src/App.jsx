import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TopicDetail from './pages/TopicDetail'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTopicClick = (topic, category) => {
    setIsTransitioning(true)
    // Push a history entry so browser back button returns to home
    window.history.pushState({ view: 'topic', topicId: topic.id }, '')
    setTimeout(() => {
      setCurrentTopic(topic)
      setCurrentCategory(category)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }

  const goHome = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTopic(null)
      setCurrentCategory(null)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }, [])

  const handleBack = () => {
    // Use history.back() so the popstate listener handles the transition
    window.history.back()
  }

  // Listen for browser back/forward button
  useEffect(() => {
    const onPopState = () => {
      goHome()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [goHome])

  const handleUpdate = () => {
    window.open(
      'https://github.com/xiaomingtongxueql/history-hotspot/actions/workflows/update-data.yml',
      '_blank'
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onSearch={setSearchQuery} onUpdate={handleUpdate} onLogoClick={currentTopic ? handleBack : undefined} />
      <main className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {currentTopic ? (
          <TopicDetail
            topic={currentTopic}
            category={currentCategory}
            onBack={handleBack}
          />
        ) : (
          <Home
            onTopicClick={handleTopicClick}
            searchQuery={searchQuery}
          />
        )}
      </main>
      <footer className="border-t border-border/50 mt-20 py-10 text-center">
        <p className="text-ink-muted text-sm">史学研究热点导航 · 数据每周自动更新 · 仅供学术研究使用</p>
      </footer>
    </div>
  )
}
