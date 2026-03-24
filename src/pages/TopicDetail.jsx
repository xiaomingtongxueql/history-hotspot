import { sortPapersByScore } from '../utils/scoring'
import PaperCard from '../components/PaperCard'

export default function TopicDetail({ topic, category, onBack }) {
  const sortedPapers = sortPapersByScore(topic.papers)

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-12 animate-fade-in">

      {/* Sticky back bar — always visible below navbar */}
      <div className="sticky top-[72px] z-30 -mx-6 px-6 py-3 glass border-b border-gold/10 mb-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-2.5 text-ink-secondary hover:text-gold transition-all duration-200 text-sm font-semibold"
        >
          <div className="w-8 h-8 rounded-full bg-ivory-deep border border-border/50 group-hover:bg-gold group-hover:border-gold group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.5 19.5L8 12m0 0l7.5-7.5M8 12h12"/>
            </svg>
          </div>
          <span>返回首页</span>
        </button>
      </div>

      {/* Header area */}
      <div className="mb-12 pb-10 border-b border-border/50">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-ink-muted mb-4">
          <span className="w-6 h-6 rounded-lg bg-gold-subtle flex items-center justify-center text-xs">{category.icon}</span>
          <span>{category.name}</span>
          <svg className="w-3.5 h-3.5 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
          <span className="text-gold font-medium">研究热点</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl text-ink font-bold mb-4 leading-tight tracking-tight">
          {topic.title}
        </h1>

        {/* Description */}
        <p className="text-ink-secondary leading-relaxed text-base max-w-2xl">{topic.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2 bg-gold-subtle border border-gold/10 rounded-full px-4 py-2 text-sm">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
            <span className="text-ink font-medium">{topic.papers.length}</span>
            <span className="text-ink-muted">篇论文</span>
          </div>
        </div>
      </div>

      {/* Paper list header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-ink font-semibold">相关权威论文</h2>
        <span className="text-[11px] text-ink-muted bg-ivory-deep px-4 py-2 rounded-full border border-border/50">
          按综合评分排序
        </span>
      </div>

      <div className="space-y-4">
        {sortedPapers.map((paper, index) => (
          <PaperCard key={paper.cnki_id || index} paper={paper} rank={index + 1} />
        ))}
      </div>

      {/* Scoring explanation */}
      <div className="mt-12 p-5 bg-gold-subtle rounded-2xl border border-gold/10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-ink text-sm mb-1">评分说明</h4>
            <p className="text-ink-muted text-xs leading-relaxed">
              综合评分 = 引用量 × 0.5 + 下载量(÷1000) × 0.3 + 时效分 × 0.2，满分 10 分。
              时效分 = max(0, 10 - (当前年份 - 发表年份))。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
