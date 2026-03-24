import { sortPapersByScore } from '../utils/scoring'
import PaperCard from '../components/PaperCard'

export default function TopicDetail({ topic, category, onBack }) {
  const sortedPapers = sortPapersByScore(topic.papers)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cream/50 hover:text-gold mb-8 transition-colors text-sm group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>返回热点列表</span>
      </button>

      {/* 主题头部 */}
      <div className="mb-8 pb-8 border-b border-gold/10">
        <div className="flex items-center gap-2 text-sm text-gold/70 mb-3">
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className="text-cream/30">›</span>
          <span>研究热点</span>
        </div>
        <h1 className="font-serif text-3xl text-cream font-bold mb-4 leading-tight">
          {topic.title}
        </h1>
        <p className="text-cream/60 leading-relaxed text-base">{topic.description}</p>
      </div>

      {/* 论文列表标题 */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-lg text-cream font-semibold">相关权威论文</h2>
        <span className="text-xs text-cream/40 bg-bg-secondary border border-gold/20 px-2 py-0.5 rounded-full">
          按综合评分排序 · 共 {sortedPapers.length} 篇
        </span>
      </div>

      {/* 论文卡片列表 */}
      <div className="space-y-4">
        {sortedPapers.map((paper, index) => (
          <PaperCard key={paper.cnki_id || index} paper={paper} rank={index + 1} />
        ))}
      </div>

      {/* 算法说明 */}
      <div className="mt-10 p-4 bg-bg-secondary/50 rounded-lg border border-gold/10 text-xs text-cream/40 leading-relaxed">
        <strong className="text-cream/60">📊 综合评分算法：</strong>
        引用量 × 0.5 + 下载量(÷1000) × 0.3 + 时效分 × 0.2，满分 10 分。
        时效分 = max(0, 10 - 距今年数)
      </div>
    </div>
  )
}
