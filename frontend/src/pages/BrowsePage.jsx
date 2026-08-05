import { Navigate, useLocation } from 'react-router-dom'

function BrowsePage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const category = params.get('category')
  const target = category
    ? `/?category=${encodeURIComponent(category)}`
    : '/'

  return <Navigate to={target} replace />
}

export default BrowsePage
