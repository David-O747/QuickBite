import CtaButton from './CtaButton'

// simple in-page popup for policy details (no extra animation libraries)
function PolicyPopup({ isOpen, titleText, bodyText, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800">{titleText}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500"
            aria-label="Close"
            data-no-misclick
          >
            ×
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {bodyText}
        </p>
        <div className="mt-6 flex justify-end">
          <CtaButton ctaButtonId="policy_got_it" onClick={onClose}>
            Got it
          </CtaButton>
        </div>
      </div>
    </div>
  )
}

export default PolicyPopup
