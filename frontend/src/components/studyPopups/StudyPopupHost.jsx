import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useStudyPopup } from '../../context/StudyPopupContext'
import { getPopupDefinition } from './popupCatalog'
import StudyPopup from './StudyPopup'

// Disabled during study data collection — see App.jsx (StudyPopupHost not mounted).
function StudyPopupHost() {
  const app = useApp()
  const navigate = useNavigate()
  const { activePopup, popupVars, dismissPopup } = useStudyPopup()

  return (
    <>
      {activePopup ? (
        <StudyPopupRenderer
          activePopup={activePopup}
          popupVars={popupVars}
          app={app}
          navigate={navigate}
          dismissPopup={dismissPopup}
        />
      ) : null}
    </>
  )
}

function StudyPopupRenderer({ activePopup, popupVars, app, navigate, dismissPopup }) {
  const definition = getPopupDefinition(activePopup)
  if (!definition) return null

  function handlePrimary() {
    if (activePopup === 'guest_checkout') {
      dismissPopup()
      navigate('/login')
      return
    }
    dismissPopup()
  }

  function handleSecondary() {
    dismissPopup()
  }

  function handleClose() {
    dismissPopup()
  }

  const enrichedVars = {
    ...popupVars,
    displayName: popupVars.displayName || app.customer?.customerUsername,
    email: popupVars.email || app.customer?.customerEmail,
  }

  return (
    <StudyPopup
      popupId={activePopup}
      popupVars={enrichedVars}
      onPrimary={handlePrimary}
      onSecondary={handleSecondary}
      onClose={handleClose}
    />
  )
}

export default StudyPopupHost
