import { useApp } from '../context/AppContext'
import { getStudyMeta, logCtaClick, markHoverStart, clearHoverStart } from '../tracking/trackingService'

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

  function handleMouseEnter() {
    markHoverStart(ctaButtonId)
  }

  function handleMouseLeave() {
    clearHoverStart(ctaButtonId)
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
