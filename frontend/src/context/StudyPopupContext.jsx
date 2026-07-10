import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { getStudyMeta, logPopupEvent } from '../tracking/trackingService'
import { POPUP_STORAGE_KEYS } from '../components/studyPopups/popupCatalog'

const StudyPopupContext = createContext(null)

export function StudyPopupProvider({ children }) {
  const app = useApp()
  const [activePopup, setActivePopup] = useState(null)
  const [popupVars, setPopupVars] = useState({})
  const dismissCallbackRef = useRef(null)

  const dismissPopup = useCallback(() => {
    if (activePopup) {
      logPopupEvent('dismiss', activePopup, getStudyMeta(app))
    }
    const callback = dismissCallbackRef.current
    dismissCallbackRef.current = null
    setActivePopup(null)
    setPopupVars({})
    if (callback) callback()
  }, [activePopup, app])

  const showPopup = useCallback(
    (popupId, vars = {}, options = {}) => {
      logPopupEvent('show', popupId, getStudyMeta(app))
      dismissCallbackRef.current = options.onDismiss || null
      setPopupVars(vars)
      setActivePopup(popupId)
    },
    [app]
  )

  const showPopupOnce = useCallback(
    (storageKey, popupId, vars = {}, options = {}) => {
      if (localStorage.getItem(storageKey) === '1') return false
      showPopup(popupId, vars, {
        ...options,
        onDismiss: () => {
          localStorage.setItem(storageKey, '1')
          if (options.onDismiss) options.onDismiss()
        },
      })
      return true
    },
    [showPopup]
  )

  const value = useMemo(
    () => ({
      activePopup,
      popupVars,
      showPopup,
      dismissPopup,
      showPopupOnce,
      storageKeys: POPUP_STORAGE_KEYS,
    }),
    [activePopup, popupVars, showPopup, dismissPopup, showPopupOnce]
  )

  return <StudyPopupContext.Provider value={value}>{children}</StudyPopupContext.Provider>
}

export function useStudyPopup() {
  const context = useContext(StudyPopupContext)
  if (!context) {
    throw new Error('useStudyPopup must be used within StudyPopupProvider')
  }
  return context
}
