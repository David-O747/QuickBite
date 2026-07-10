// Neutral icons via Iconify CDN — identical asset on Site A and Site B
function PopupIcon({ iconId, size = 32, className = '', color = 'dc2626' }) {
  const iconUrl = `https://api.iconify.design/${iconId}.svg?color=%23${color}&width=${size}&height=${size}`

  return (
    <img
      src={iconUrl}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      loading="lazy"
    />
  )
}

export default PopupIcon
