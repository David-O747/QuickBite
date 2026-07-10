function SuccessBanner({ messageText, isVisible }) {
  return (
    <div
      className={`mi-success-banner mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 ${
        isVisible ? 'mi-visible' : ''
      }`}
      role="status"
    >
      {messageText}
    </div>
  )
}

export default SuccessBanner
