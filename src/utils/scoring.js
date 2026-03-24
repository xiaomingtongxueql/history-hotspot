// 权重算法：引用量50% + 下载量30% + 时效20%
export function calculateScore(paper) {
  const currentYear = new Date().getFullYear()
  const age = Math.max(0, currentYear - paper.year)
  const recencyScore = Math.max(0, 10 - age)
  const normalizedDownloads = Math.min(paper.downloads / 1000, 10)
  const normalizedCitations = Math.min(paper.citations / 100, 10)
  return parseFloat((normalizedCitations * 0.5 + normalizedDownloads * 0.3 + recencyScore * 0.2).toFixed(1))
}

export function sortPapersByScore(papers) {
  return [...papers]
    .map(p => ({ ...p, score: calculateScore(p) }))
    .sort((a, b) => b.score - a.score)
}
