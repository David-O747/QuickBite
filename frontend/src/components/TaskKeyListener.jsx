import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getStudyMeta, logTaskMarker } from '../tracking/trackingService'

/**
 * Researcher hotkeys for verbal task markers only.
 * Timers themselves are started/stopped by page navigation:
 * - locate_product: home -> restaurant menu
 * - add_to_basket: restaurant menu -> add item
 * - complete_checkout: basket -> order confirmation
 */
function TaskKeyListener() {
  const app = useApp()

  useEffect(() => {
    function handleKeyDown(event) {
      if (!event.altKey || !event.shiftKey) return
      if (!app.isStudySession) return

      const studyMeta = getStudyMeta(app)

      if (event.code === 'Digit2') {
        event.preventDefault()
        logTaskMarker('add_to_basket', 'verbal_start', studyMeta)
      }

      if (event.code === 'Digit3') {
        event.preventDefault()
        logTaskMarker('complete_checkout', 'verbal_start', studyMeta)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [app])

  return null
}

export default TaskKeyListener
