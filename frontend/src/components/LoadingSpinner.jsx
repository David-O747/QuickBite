// MI 3: simple centered spinner only
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-label="Loading">
      <div className="mi-spinner" />
    </div>
  )
}

export default LoadingSpinner
