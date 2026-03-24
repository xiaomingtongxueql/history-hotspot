import { sortPapersByScore } from '../utils/scoring'
import PaperCard from '../components/PaperCard'

export default function TopicDetail({ topic, category, onBack }) {
  const sortedPapers = sortPapersByScore(topic.papers)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-secondary hover:text-ink mb-8 transition-colors text-sm font-medium group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
        </svg>
        返回
      </button>

      <div className="mb-10 pb-10 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-ink-muted mb-3">
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span>/</span>
          <span className="text-ink-secondary">研究热点</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink font-bold mb-4 leading-tight">
          {topic.title}
        </h1>
        <p className="text-ink-secondary leading-relaxed text-base max-w-2xl">{topic.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-lg text-ink font-semibold">相关权威论文</h2>
        <span className="text-xs text-ink-muted bg-bg-hover px-3 py-1 rounded-full">
          按综合评分排序 · {sortedPapers.length} 篇
        </span>
      </div>

      <div className="space-y-3">
        {sortedPapers.map((paper, index) => (
          <PaperCard key={paper.cnki_id || index} paper={paper} rank={index + 1} />
        ))}
      </div>

      <div className="mt-10 p-4 bg-bg-hover rounded-xl text-xs text-ink-muted leading-relaxed">
        <strong className="text-ink-secondary">评分说明：</strong>
        综合评分 = 引用量 × 0.5 + 下载量(÷1000) × 0.3 + 时效分 × 0.2，满分 10 分。
      </div>
    </div>
  )
}
