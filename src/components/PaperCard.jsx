import { useState } from 'react'
import DownloadModal from './DownloadModal'

export default function PaperCard({ paper, rank }) {
  const [showModal, setShowModal] = useState(false)

  const getRankDisplay = (rank) => {
    if (rank <= 3) return ['🥇', '🥈', '🥉'][rank - 1]
    return rank
  }

  return (
    <>
      <div className="group bg-bg-secondary rounded-card p-5 border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex gap-4">
          <div className={`flex-shrink-0 w-8 text-center text-lg font-serif font-bold mt-0.5 ${
            rank <= 3 ? '' : 'text-ink-faint text-base'
          }`}>
            {getRankDisplay(rank)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-serif text-ink font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
                {paper.title}
              </h4>
              <div className="flex-shrink-0 flex items-center gap-1 bg-gold-light rounded-full px-2 py-0.5">
                <span className="text-gold text-[10px]">★</span>
                <span className="text-gold text-xs font-semibold">{paper.score ?? '--'}</span>
              </div>
            </div>
            <p className="text-ink-secondary text-xs mb-3">
              {paper.authors?.join('、') || '—'} · {paper.journal} · {paper.year} 年 {paper.source && <span className="text-gold bg-gold/10 px-1.5 py-0.5 rounded ml-1">来源：{paper.source}</span>}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs text-ink-muted">
                <span>引用 <strong className="text-ink-secondary">{paper.citations}</strong></span>
                <span>下载 <strong className="text-ink-secondary">{paper.downloads >= 1000 ? (paper.downloads / 1000).toFixed(1) + 'k' : paper.downloads}</strong></span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                aria-label={`下载论文：${paper.title}`}
                className="text-xs bg-bg-primary hover:bg-ink hover:text-bg-primary border border-border hover:border-ink text-ink-secondary px-3 py-1.5 rounded-full transition-all duration-200 font-medium flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                下载
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
