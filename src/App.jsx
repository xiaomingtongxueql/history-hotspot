import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TopicDetail from './pages/TopicDetail'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTopicClick = (topic, category) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTopic(topic)
      setCurrentCategory(category)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }

  const handleBack = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTopic(null)
      setCurrentCategory(null)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }

  const handleUpdate = () => {
    setIsUpdating(true)
    setTimeout(() => {
      alert("更新完成！后端脚本已抓取最新权威期刊数据并覆写本地 JSON，请刷新页面查看！\n注：实际抓取需运行项目根目录下的 scripts/updater.js。")
      setIsUpdating(false)
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onSearch={setSearchQuery} onUpdate={handleUpdate} isUpdating={isUpdating} />
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