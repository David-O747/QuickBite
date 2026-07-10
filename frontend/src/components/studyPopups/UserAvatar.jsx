// Factual initials avatar — same API and styling on Site A and Site B
function UserAvatar({ displayName = 'Guest', size = 64, className = '' }) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dc2626&color=fff&size=${size}&bold=true`

  return (
    <img
      src={avatarUrl}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`rounded-full shrink-0 ${className}`}
      loading="lazy"
    />
  )
}

export default UserAvatar
