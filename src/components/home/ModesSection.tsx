import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

export function ModesSection() {
  const t = useTranslations('modes')

  const modes = (['m1', 'm2', 'm3'] as const).map((k) => ({
    badge: t(`${k}.badge` as `m1.badge` | `m2.badge` | `m3.badge`),
    user:  t(`${k}.user` as `m1.user` | `m2.user` | `m3.user`),
    title: t(`${k}.title` as `m1.title` | `m2.title` | `m3.title`),
    desc:  t(`${k}.desc` as `m1.desc` | `m2.desc` | `m3.desc`),
    feats: t.raw(`${k}.feats` as `m1.feats` | `m2.feats` | `m3.feats`) as string[],
  }))

  return (
    <section id="modes" className="py-24 bg-bg-card/30">
      <div className="max-w-site mx-auto px-8 md:px-12">
        <Reveal className="text-center mb-16">
          <div className="text-xs font-mono text-amber uppercase tracking-widest mb-3">{t('eyebrow')}</div>
          <h2
            className="font-display text-4xl md:text-5xl text-text mb-4"
            dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
          />
          <p className="text-text-2 max-w-2xl mx-auto">{t('desc')}</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((m, i) => (
            <Reveal key={m.badge} delay={i * 100}>
              <div className="rounded-[20px] border border-border bg-bg-card p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-mono text-amber border border-amber/30 rounded-full px-3 py-1"
                    style={{ background: 'rgba(192,120,56,0.08)' }}
                  >
                    {m.badge}
                  </span>
                  <span className="text-xs text-text-dim">{m.user}</span>
                </div>
                <div className="font-display text-xl text-text mb-3">{m.title}</div>
                <p className="text-sm text-text-2 leading-relaxed mb-6 flex-1">{m.desc}</p>
                <ul className="space-y-2">
                  {m.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-amber mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
