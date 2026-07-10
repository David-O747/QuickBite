import { InfoIconBadge } from './InfoTopicIcons'

export function InfoTopicCard({ iconKey, title, summary, actionLabel, onOpen, tone = 'red', featured = false }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`text-left rounded-2xl border border-gray-200 bg-white shadow-md p-5 flex flex-col ${
        featured ? 'md:row-span-2 md:justify-between' : ''
      }`}
    >
      <div>
        <InfoIconBadge iconKey={iconKey} tone={tone} size={featured ? 'lg' : 'md'} />
        <h2 className={`font-bold text-red-600 mt-4 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {title}
        </h2>
        <p className={`mt-2 text-gray-600 ${featured ? 'text-base' : 'text-sm'}`}>{summary}</p>
      </div>
      <p className="mt-5 text-sm font-semibold text-gray-800">{actionLabel}</p>
    </button>
  )
}

export function InfoChannelCard({ iconKey, title, body, meta, tone = 'red' }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white shadow-md p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[3rem]" />
      <InfoIconBadge iconKey={iconKey} tone={tone} size="lg" />
      <h2 className="font-bold text-xl text-gray-900 mt-5">{title}</h2>
      <p className="mt-2 text-gray-600 leading-relaxed">{body}</p>
      {meta && <p className="mt-4 text-sm font-medium text-red-600">{meta}</p>}
    </article>
  )
}

export function InfoNumberedBlock({ stepNumber, iconKey, title, body }) {
  return (
    <article className="grid md:grid-cols-[auto_1fr] gap-5 rounded-2xl border border-gray-100 bg-white shadow-md p-6 md:p-8">
      <div className="flex md:flex-col items-center md:items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">
          {stepNumber}
        </span>
        <InfoIconBadge iconKey={iconKey} tone="gray" size="md" />
      </div>
      <div>
        <h2 className="font-bold text-xl text-red-600">{title}</h2>
        <p className="mt-3 text-gray-700 leading-relaxed">{body}</p>
      </div>
    </article>
  )
}
