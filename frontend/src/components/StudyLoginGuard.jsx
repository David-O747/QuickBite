import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const PUBLIC_PATHS = new Set(['/login', '/register'])

function StudyLoginGuard() {
  const app = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!app.isStudySession || app.isLoggedIn) return
    if (PUBLIC_PATHS.has(location.pathname)) return
    navigate(`/login${location.search}`, { replace: true })
  }, [app.isStudySession, app.isLoggedIn, location.pathname, location.search, navigate])

  return null
}

export default StudyLoginGuard
