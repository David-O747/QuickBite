const checkoutSteps = [
  { stepKey: 'basket', stepLabel: 'Basket' },
  { stepKey: 'payment', stepLabel: 'Checkout' },
  { stepKey: 'confirm', stepLabel: 'Confirm' },
]

function CheckoutProgress({ currentStepKey }) {
  const currentIndex = checkoutSteps.findIndex((s) => s.stepKey === currentStepKey)

  return (
    <div className="flex items-center gap-2 mb-8 max-w-xl mx-auto">
      {checkoutSteps.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.stepKey} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`mi-step-dot ${isDone ? 'mi-done' : ''} ${isCurrent ? 'mi-current' : ''}`}
              >
                {isDone ? '✓' : index + 1}
              </div>
              <span className="mt-1 text-xs text-gray-600">{step.stepLabel}</span>
            </div>
            {index < checkoutSteps.length - 1 && (
              <div className={`mi-step-line mx-2 ${isDone ? 'mi-done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutProgress
