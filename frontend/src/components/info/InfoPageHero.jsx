import { InfoIconBadge, topicIcons } from './InfoTopicIcons'

// designed hero — gradient + topic icon, no unrelated stock photos
function InfoPageHero({ titleText, introText, iconKey = 'help', badgeText = '' }) {
  const heroIcon = topicIcons[iconKey]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-600 text-white">
      <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-black/10" />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-orange-300/20" />

      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          {badgeText && (
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-200 mb-3">
              {badgeText}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">{titleText}</h1>
          {introText && (
            <p className="mt-4 max-w-xl text-red-50 text-lg leading-relaxed">{introText}</p>
          )}
        </div>

        <div className="hidden md:flex w-28 h-28 rounded-3xl bg-white/15 ring-1 ring-white/25 items-center justify-center text-white">
          {heroIcon}
        </div>
      </div>
    </section>
  )
}

export default InfoPageHero

export function InfoStatStrip({ items }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4 -mt-8 relative z-10 max-w-6xl mx-auto px-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl bg-white border border-gray-100 shadow-lg p-5 flex items-center gap-4"
        >
          <InfoIconBadge iconKey={item.iconKey} tone={item.tone || 'red'} size="md" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
