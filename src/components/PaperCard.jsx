const DOWNLOAD_BASE_URL = 'https://3.shutong2.com/search'

export default function PaperCard({ paper, rank }) {
  const handleDownload = () => {
    const url = `${DOWNLOAD_BASE_URL}?q=${encodeURIComponent(paper.title)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getRankDisplay = (rank) => {
    if (rank <= 3) return ['🥇','🥈','🥉'][rank-1]
    return rank
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-cream/30'
  }

  return (
    <div className="group bg-bg-secondary rounded-lg p-5 border border-gold/10 hover:border-gold/40 transition-all duration-200">
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-8 text-center text-xl font-bold font-serif ${getRankColor(rank)} mt-0.5`}>
          {getRankDisplay(rank)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-serif text-cream font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
              {paper.title}
            </h4>
            <div className="flex-shrink-0 flex items-center gap-1 bg-bg-primary border border-gold/40 rounded-full px-2.5 py-0.5">
              <span className="text-gold text-xs">⭐</span>
              <span className="text-gold text-xs font-bold">{paper.score}</span>
            </div>
          </div>
          <p className="text-cream/50 text-xs mb-3">
            {paper.authors.join('、')} · {paper.journal} · {paper.year}年
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-cream/40">
              <span>📖 引用 <strong className="text-cream/70">{paper.citations}</strong></span>
              <span>⬇️ 下载 <strong className="text-cream/70">{paper.downloads >= 1000 ? (paper.downloads/1000).toFixed(1)+'k' : paper.downloads}</strong></span>
            </div>
            <button
              onClick={handleDownload}
              className="text-xs bg-gold/10 hover:bg-gold text-gold hover:text-bg-primary border border-gold/40 hover:border-gold px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
            >
              立即下载
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
