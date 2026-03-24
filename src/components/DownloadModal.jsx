import { useEffect } from 'react'

export default function DownloadModal({ paper, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleDownload = () => {
    const url = `https://3.shutong2.com/search?q=${encodeURIComponent(paper.title)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />

      {/* Modal 主体 */}
      <div className="relative bg-bg-secondary rounded-modal shadow-modal w-full max-w-lg overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="h-0.5 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

        <div className="p-6">
          {/* 标题区 */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gold-light text-gold font-medium px-2 py-0.5 rounded-full">论文下载</span>
              </div>
              <h3 className="font-serif text-lg text-ink font-semibold leading-snug pr-8">
                {paper.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-bg-hover flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
              aria-label="关闭"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* 论文信息 */}
          <div className="bg-bg-primary rounded-xl p-4 mb-5 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-muted w-14">作者</span>
              <span className="text-ink font-medium">{paper.authors?.join('、') || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-muted w-14">期刊</span>
              <span className="text-ink">{paper.journal}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-muted w-14">年份</span>
              <span className="text-ink">{paper.year} 年</span>
            </div>
            <div className="flex items-center gap-4 pt-1 border-t border-border mt-1">
              <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
                引用 <strong className="text-ink">{paper.citations}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                下载 <strong className="text-ink">{paper.downloads >= 1000 ? (paper.downloads / 1000).toFixed(1) + 'k' : paper.downloads}</strong>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs">
                <span className="text-gold">★</span>
                <strong className="text-ink font-semibold">{paper.score}</strong>
              </div>
            </div>
          </div>

          {/* 使用提示 */}
          <div className="flex items-start gap-2.5 text-xs text-ink-secondary bg-gold-light rounded-lg p-3 mb-5">
            <svg className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
            </svg>
            <span>点击下方按钮将在新窗口打开书童图书馆，搜索框已预填论文标题，直接点击下载即可。</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-ink-secondary text-sm font-medium hover:bg-bg-hover transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleDownload}
              className="flex-2 px-6 py-2.5 rounded-xl bg-ink text-bg-primary text-sm font-medium hover:bg-ink/90 transition-all flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              前往下载
              <svg className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
