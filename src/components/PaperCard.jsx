import { useState } from 'react'
import DownloadModal from './DownloadModal'

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n'
  return (
    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-sm ${cls}`}>
      {rank <= 3 ? ['Ⅰ', 'Ⅱ', 'Ⅲ'][rank - 1] : rank}
    </div>
  )
}

function SourceTag({ source }) {
  if (!source) return null
  const cls = source === 'CNKI' ? 'tag-source tag-cnki' : 'tag-source tag-wanfang'
  return <span className={cls}>{source}</span>
}

export default function PaperCard({ paper, rank }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        className="group bg-surface rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover hover:border-gold/25 transition-all duration-300 card-sweep animate-slide-up overflow-hidden"
        style={{ animationDelay: `${(rank - 1) * 50}ms` }}
      >
        <div className="flex gap-4 px-5 pt-5 pb-4">

          {/* Rank badge */}
          <RankBadge rank={rank} />

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Title + score */}
            <div className="flex items-start gap-3 mb-2">
              <h4 className="flex-1 font-heading text-ink font-semibold text-[0.875rem] leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                {paper.title}
              </h4>
              <div className="flex-shrink-0 flex items-center gap-1 bg-gold-subtle border border-gold/10 rounded-full px-2.5 py-1">
                <span className="text-gold-light text-[10px]">◆</span>
                <span className="text-gold text-xs font-semibold tabular-nums">{paper.score ?? '--'}</span>
              </div>
            </div>

            {/* Meta row: authors · journal · year · source tag */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-muted mb-3">
              <span className="truncate max-w-[180px]">{paper.authors?.join('、') || '—'}</span>
              <span className="text-border">·</span>
              <span className="text-ink-secondary font-medium">{paper.journal || '未知期刊'}</span>
              <span className="text-border">·</span>
              <span>{paper.year} 年</span>
              {paper.source && <SourceTag source={paper.source} />}
            </div>

            {/* Stats + download */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-[11px] text-ink-muted">
                {/* Citations */}
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
                  </svg>
                  <strong className="text-ink-secondary font-semibold">{paper.citations}</strong>
                  <span>引用</span>
                </span>
                {/* Downloads */}
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  <strong className="text-ink-secondary font-semibold">
                    {paper.downloads >= 1000 ? (paper.downloads / 1000).toFixed(1) + 'k' : paper.downloads}
                  </strong>
                  <span>下载</span>
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                aria-label={`获取论文：${paper.title}`}
                className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide bg-ink hover:bg-gold text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-gold-glow active:scale-[0.97]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                获取
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <DownloadModal paper={paper} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
