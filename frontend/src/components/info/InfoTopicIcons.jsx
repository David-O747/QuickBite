// topic-matched SVG icons for info/legal pages — QuickBite red style, no photos

const iconProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function IconBase({ children, size = 32 }) {
  return (
    <svg {...iconProps} width={size} height={size}>
      {children}
    </svg>
  )
}

export const topicIcons = {
  'data-we-collect': (
    <IconBase>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </IconBase>
  ),
  'how-we-use': (
    <IconBase>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15l3-4 3 2 4-6" />
    </IconBase>
  ),
  'study-tracking': (
    <IconBase>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </IconBase>
  ),
  'data-sharing': (
    <IconBase>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="7" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M8.4 11.2l7.2-3.4M8.4 12.8l7.2 3.4" />
    </IconBase>
  ),
  'your-rights': (
    <IconBase>
      <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </IconBase>
  ),
  'data-retention': (
    <IconBase>
      <path d="M5 5h14v14H5z" />
      <path d="M9 3v4M15 3v4M8 11h8M8 15h5" />
    </IconBase>
  ),
  'essential-cookies': (
    <IconBase>
      <path d="M12 3c-4 0-7 3-7 7 0 5 4 9 7 11 3-2 7-6 7-11 0-4-3-7-7-7z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  ),
  'preference-cookies': (
    <IconBase>
      <path d="M4 6h16M4 12h10M4 18h14" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </IconBase>
  ),
  'study-cookies': (
    <IconBase>
      <path d="M4 18V6l8-3 8 3v12l-8 3-8-3z" />
      <path d="M12 9v12M4 6l8 3 8-3" />
    </IconBase>
  ),
  'manage-cookies': (
    <IconBase>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </IconBase>
  ),
  support: (
    <IconBase>
      <path d="M4 14a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2h-1.5" />
      <path d="M8 20h2M14 20h2" />
      <path d="M12 14v3" />
    </IconBase>
  ),
  partners: (
    <IconBase>
      <path d="M4 10h16v10H4z" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M9 14h6" />
    </IconBase>
  ),
  press: (
    <IconBase>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 13h4" />
    </IconBase>
  ),
  roles: (
    <IconBase>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 4 0v2" />
      <path d="M3 12h18" />
    </IconBase>
  ),
  apply: (
    <IconBase>
      <path d="M4 12h12M12 6l6 6-6 6" />
      <path d="M4 4v16" />
    </IconBase>
  ),
  service: (
    <IconBase>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </IconBase>
  ),
  pricing: (
    <IconBase>
      <path d="M6 6h12v12H6z" />
      <path d="M8 10h8M8 14h5" />
      <path d="M16 14h.01" />
    </IconBase>
  ),
  liability: (
    <IconBase>
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
      <path d="M12 8v5M12 16h.01" />
    </IconBase>
  ),
  orders: (
    <IconBase>
      <path d="M7 4h10l2 4v12H5V8l2-4z" />
      <path d="M9 4v4h6V4" />
    </IconBase>
  ),
  delivery: (
    <IconBase>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7v-5z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </IconBase>
  ),
  payment: (
    <IconBase>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </IconBase>
  ),
  privacy: (
    <IconBase size={48}>
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4-1.5-7-4.5-7-9V7l7-4z" />
    </IconBase>
  ),
  cookie: (
    <IconBase size={48}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </IconBase>
  ),
  contact: (
    <IconBase size={48}>
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </IconBase>
  ),
  careers: (
    <IconBase size={48}>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </IconBase>
  ),
  terms: (
    <IconBase size={48}>
      <path d="M8 4h8l4 4v12H8z" />
      <path d="M16 4v4h4M10 13h6M10 17h4" />
    </IconBase>
  ),
  help: (
    <IconBase size={48}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 2-2.5 2-2.5 4" />
      <circle cx="12" cy="17.5" r=".8" fill="currentColor" stroke="none" />
    </IconBase>
  ),
}

export function InfoIconBadge({ iconKey, tone = 'red', size = 'md' }) {
  const tones = {
    red: 'bg-red-50 text-red-600 ring-red-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
    gray: 'bg-gray-50 text-gray-700 ring-gray-100',
    green: 'bg-green-50 text-green-700 ring-green-100',
  }
  const sizes = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }

  return (
    <div
      className={`${sizes[size]} ${tones[tone]} rounded-2xl ring-1 flex items-center justify-center shrink-0`}
    >
      {topicIcons[iconKey]}
    </div>
  )
}
