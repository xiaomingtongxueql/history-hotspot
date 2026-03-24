import { useState } from 'react'
import DownloadModal from './DownloadModal'

export default function PaperCard({ paper, rank }) {
  const [showModal, setShowModal] = useState(false)

  const getRankStyle = (rank) => {
    if (rank === 1) return { bg: 'bg-gradient-to-br from-amber-400 to-amber-500', text: 'text-white', shadow: 'shadow-lg shadow-amber-500/30' }
    if (rank === 2) return { bg: 'bg-gradient-to-br from-slate-300 to-slate-400', text: 'text-white', shadow: 'shadow-lg shadow-slate-400/30' }
    if (rank === 3) return { bg: 'bg-gradient-to-br from-amber-600 to-amber-700', text: 'text-white', shadow: 'shadow-lg shadow-amber-700/30' }
    return { bg: 'bg-bg-hover', text: 'text-ink-muted', shadow: '' }
  }

  const style = getRankStyle(rank)

  return (
    <>
      <div 
        className="group bg-white rounded-2xl p-5 border border-border/50 shadow-card hover:shadow-lg hover:border-gold/20 transition-all duration-300 ease-out-expo animate-slide-up"
        style={{ animationDelay: `${(rank - 1) * 50}ms` }}
      >
        <div className="flex gap-4">
          {/* 排名 */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.bg} ${style.text} ${style.shadow} flex items-center justify-center font-heading font-bold text-lg`}>
            {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-heading text-ink font-semibold text-sm leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                {paper.title}
              </h4>
              <div className="flex-shrink-0 flex items-center gap-1 bg-gold-subtle rounded-full px-2.5 py-1">
                <span className="text-gold text-xs">★</span>
                <span className="text-gold text-sm font-semibold">{paper.score ?? '--'}</span>
              </div>
            </div>

            <p className="text-ink-muted text-xs mb-3 leading-relaxed">
              {paper.authors?.join('、') || '—'}
              <span className="mx-1.5">·</span>
              {paper.journal || '未知期刊'}
              <span className="mx-1.5">·</span>
              {paper.year} 年
              {paper.source && (
                <span className="ml-2 text-gold bg-gold-subtle px-2 py-0.5 rounded-full text-[10px] font-medium">
                  {paper.source}
                </span>
              )}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-5 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
                  </svg>
                  <strong className="text-ink-secondary">{paper.citations}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  <strong className="text-ink-secondary">{paper.downloads >= 1000 ? (paper.downloads / 1000).toFixed(1) + 'k' : paper.downloads}</strong>
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                aria-label={`下载论文：${paper.title}`}
                className="flex items-center gap-1.5 text-xs bg-ink hover:bg-gold text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-[0.97]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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