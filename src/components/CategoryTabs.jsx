export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="sticky top-[65px] z-40 bg-bg-primary border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-3" style={{scrollbarWidth: 'none'}}>
          <button
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
              activeId === null ? 'bg-gold text-bg-primary font-bold' : 'text-cream/60 hover:text-cream hover:bg-bg-secondary'
            }`}
          >全部</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                activeId === cat.id ? 'bg-gold text-bg-primary font-bold' : 'text-cream/60 hover:text-cream hover:bg-bg-secondary'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
