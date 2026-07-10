const defaultTimeline = {
  preparingAt: 15000,
  onTheWayAt: 32000,
  deliveredAt: 52000,
}

export function getOrderTimeline(order) {
  return { ...defaultTimeline, ...(order?.statusTimelineMs || {}) }
}

export function getDeliveryStage(order, elapsedMs = null) {
  if (!order?.placedAt) return 0
  const elapsed =
    elapsedMs ?? Date.now() - new Date(order.placedAt).getTime()
  const timeline = getOrderTimeline(order)
  if (elapsed >= timeline.deliveredAt) return 3
  if (elapsed >= timeline.onTheWayAt) return 2
  if (elapsed >= timeline.preparingAt) return 1
  return 0
}

export function getDeliveryProgressPercent(stage) {
  if (stage === 0) return 12.5
  if (stage === 1) return 40
  if (stage === 2) return 75
  return 100
}

export function getDeliveryStageInfo(order, stage) {
  const eta = order?.estimatedArrival || '25–35 minutes'
  const info = [
    {
      headline: eta,
      status: 'Order confirmed',
      detail: 'The restaurant has received your order.',
    },
    {
      headline: 'Preparing',
      status: 'Kitchen is preparing your food',
      detail: 'Your items are being made now.',
    },
    {
      headline: 'On the way',
      status: 'Courier is on the way',
      detail: 'Your driver is heading to your address.',
    },
    {
      headline: 'Delivered',
      status: 'Order delivered',
      detail: 'Your order has arrived. Enjoy your meal!',
    },
  ]
  return info[stage] || info[0]
}

export function isOrderActive(order) {
  return getDeliveryStage(order) < 3
}
