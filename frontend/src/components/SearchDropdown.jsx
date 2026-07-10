import { highlightMatch } from '../utils/searchHelpers'

function SearchDropdown({ results, query, activeIndex, isLoading, onSelect }) {
  const flatResults = [...results.restaurants, ...results.dishes]
  const hasResults = flatResults.length > 0

  return (
    <div
      role="listbox"
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-40 max-h-80 overflow-y-auto"
    >
      {isLoading && (
        <div className="p-4 space-y-2" aria-label="Searching">
          <div className="h-4 bg-gray-100 rounded skeleton-shimmer" />
          <div className="h-4 bg-gray-100 rounded skeleton-shimmer w-3/4" />
          <div className="h-4 bg-gray-100 rounded skeleton-shimmer w-1/2" />
        </div>
      )}

      {!isLoading && !hasResults && (
        <p className="p-4 text-sm text-gray-500">No results for &apos;{query}&apos;</p>
      )}

      {!isLoading && results.restaurants.length > 0 && (
        <div className="p-2">
          <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">Restaurants</p>
          {results.restaurants.map((row, index) => (
            <button
              key={row.key}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeIndex === index ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(row)}
            >
              {highlightMatch(row.item.restaurantName, query).map((part, i) => (
                <span key={i} className={part.bold ? 'font-bold' : ''}>{part.text}</span>
              ))}
            </button>
          ))}
        </div>
      )}

      {!isLoading && results.dishes.length > 0 && (
        <div className={`p-2 ${results.restaurants.length > 0 ? 'border-t' : ''}`}>
          <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">Dishes</p>
          {results.dishes.map((row, index) => {
            const resultIndex = results.restaurants.length + index
            return (
              <button
                key={row.key}
                type="button"
                role="option"
                aria-selected={activeIndex === resultIndex}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeIndex === resultIndex ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(row)}
              >
                {highlightMatch(row.item.dishName, query).map((part, i) => (
                  <span key={i} className={part.bold ? 'font-bold' : ''}>{part.text}</span>
                ))}
                <span className="text-gray-400 text-xs ml-1">
                  — {highlightMatch(row.item.restaurantName, query).map((part, i) => (
                    <span key={i} className={part.bold ? 'font-bold' : ''}>{part.text}</span>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
