import { useTranslations } from 'next-intl'

export function StatsBar() {
  const t = useTranslations('stats')
  const items = [
    { v: t('v1'), l: t('l1') },
    { v: t('v2'), l: t('l2') },
    { v: t('v3'), l: t('l3') },
    { v: t('v4'), l: t('l4') },
  ]
  return (
    <div className="border-y border-border bg-bg-card/50">
      <div className="max-w-site mx-auto px-8 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(({ v, l }) => (
          <div key={l} className="text-center">
            <div className="font-display text-4xl text-amber mb-1">{v}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
