import { Navigate } from 'react-router-dom'

// Study uses restaurant menu for product view; standalone product pages are disabled.
function ProductPage() {
  return <Navigate to="/" replace />
}

export default ProductPage
