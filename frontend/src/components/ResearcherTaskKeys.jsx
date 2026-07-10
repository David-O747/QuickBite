import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getStudyMeta, logTaskMarker, startTaskTimer } from '../tracking/trackingService'

function ResearcherTaskKeys() {
  const app = useApp()

  useEffect(() => {
    function handleKeyDown(event) {
      if (!event.altKey || !event.shiftKey) return

      const studyMeta = getStudyMeta(app)

      if (event.code === 'Digit2') {
        event.preventDefault()
        startTaskTimer('add_to_basket')
        logTaskMarker('add_to_basket', 'verbal_start', studyMeta)
      }

      if (event.code === 'Digit3') {
        event.preventDefault()
        startTaskTimer('complete_checkout')
        logTaskMarker('complete_checkout', 'verbal_start', studyMeta)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [app])

  return null
}

export default ResearcherTaskKeys
