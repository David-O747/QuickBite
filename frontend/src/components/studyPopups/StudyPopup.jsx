import CtaButton from '../CtaButton'
import PopupIcon from './PopupIcon'
import UserAvatar from './UserAvatar'
import { getPopupDefinition, resolvePopupText } from './popupCatalog'

function StudyPopup({
  popupId,
  popupVars = {},
  onPrimary,
  onSecondary,
  onClose,
}) {
  const definition = getPopupDefinition(popupId)
  if (!definition) return null

  const titleText = resolvePopupText(definition.titleText, popupVars)
  const bodyText = resolvePopupText(definition.bodyText, popupVars)
  const avatarName = popupVars.displayName || popupVars.customerUsername || 'Guest'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`popup-title-${popupId}`}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {definition.showAvatar ? (
                <UserAvatar displayName={avatarName} size={52} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <PopupIcon iconId={definition.iconId} size={28} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-400">QuickBite</p>
                <h2 id={`popup-title-${popupId}`} className="text-lg font-bold text-gray-900 mt-0.5 leading-snug">
                  {titleText}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-gray-400 shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bodyText}</p>

          <div className="mt-6 space-y-2">
            <CtaButton
              ctaButtonId={definition.primaryCtaId}
              className="w-full rounded-lg"
              onClick={onPrimary}
            >
              {definition.primaryLabel}
            </CtaButton>

            {definition.secondaryLabel && (
              <CtaButton
                ctaButtonId={definition.secondaryCtaId}
                className="w-full rounded-lg !bg-white !text-gray-700 border border-gray-200"
                onClick={onSecondary || onClose}
              >
                {definition.secondaryLabel}
              </CtaButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPopup
