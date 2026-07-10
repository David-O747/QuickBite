import { useApp } from '../context/AppContext'
import { useMicroInteractions } from '../context/MicroInteractionsContext'
import { getStudyMeta, logCtaClick, markHoverStart, clearHoverStart } from '../tracking/trackingService'

// MI 1 + 2: click confirmation and hover — CSS only when mi enabled
function CtaButton({
  ctaButtonId,
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  form,
}) {
  const app = useApp()
  const miEnabled = useMicroInteractions()

  function handleMouseEnter() {
    if (miEnabled) markHoverStart(ctaButtonId)
  }

  function handleMouseLeave() {
    if (miEnabled) clearHoverStart(ctaButtonId)
  }

  function handleClick(event) {
    logCtaClick(ctaButtonId, event, getStudyMeta(app))
    if (onClick) onClick(event)
  }

  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      data-cta-id={ctaButtonId}
      className={`mi-cta px-5 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default CtaButton
