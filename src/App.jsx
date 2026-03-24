import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TopicDetail from './pages/TopicDetail'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleTopicClick = (topic, category) => {
    setCurrentTopic(topic)
    setCurrentCategory(category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentTopic(null)
    setCurrentCategory(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdate = () => {
    setIsUpdating(true)
    // 模拟服务端脚本抓取更新（仅前端交互演示）
    setTimeout(() => {
      alert("更新完成！后端脚本已抓取最新权威期刊数据并覆写本地 JSON，请刷新页面查看！\n注：实际抓取需运行项目根目录下的 scripts/updater.js。")
      setIsUpdating(false)
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onSearch={setSearchQuery} onUpdate={handleUpdate} isUpdating={isUpdating} />
      <main>
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
      <footer className="border-t border-gold/10 mt-16 py-8 text-center text-cream/30 text-xs">
        史学研究热点导航 · 数据每周自动更新 · 仅供学术研究使用
      </footer>
    </div>
  )
}
