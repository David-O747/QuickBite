import { allCategoryNames } from '../data/homeContent'

function CategoryListModal({ isOpen, onClose, onPickCategory, activeCategory }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">All categories</h3>
          <button type="button" onClick={onClose} className="text-xl text-gray-500">×</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allCategoryNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { onPickCategory(name); onClose() }}
              className={`qb-btn py-3 rounded-xl text-sm border ${activeCategory === name ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 hover:border-red-300'}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryListModal
