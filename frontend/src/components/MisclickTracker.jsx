import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getStudyMeta, logMisclick } from '../tracking/trackingService'

// silent misclick logging — clicks outside any CTA button
function MisclickTracker() {
  const app = useApp()

  useEffect(() => {
    function handleDocumentClick(event) {
      const ctaElement = event.target.closest('[data-cta-id]')
      if (ctaElement) return

      const ignoredElement = event.target.closest('[data-no-misclick]')
      if (ignoredElement) return

      logMisclick(event, getStudyMeta(app))
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [app])

  return null
}

export default MisclickTracker
