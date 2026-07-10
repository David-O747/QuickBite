import { Navigate } from 'react-router-dom'

// Study uses home → restaurant menu only; browse is not part of the participant path.
function BrowsePage() {
  return <Navigate to="/" replace />
}

export default BrowsePage
