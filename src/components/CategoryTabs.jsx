export default function CategoryTabs({ categories = [], activeId, onSelect }) {
  return (
    <div className="sticky top-[65px] z-40 bg-bg-primary/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeId === null
                ? 'bg-ink text-bg-primary'
                : 'text-ink-secondary hover:text-ink hover:bg-bg-hover'
            }`}
            aria-pressed={activeId === null}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeId === cat.id
                  ? 'bg-ink text-bg-primary'
                  : 'text-ink-secondary hover:text-ink hover:bg-bg-hover'
              }`}
              aria-pressed={activeId === cat.id}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
