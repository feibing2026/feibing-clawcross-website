import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

const HAND_ICONS = ['⚡', '🌐', '🖥️']
const HAND_COLORS = ['#C07838', '#7868A8', '#4878AC']

export function HandsSection() {
  const t = useTranslations('hands')

  const hands = (['h1', 'h2', 'h3'] as const).map((k, i) => ({
    icon: HAND_ICONS[i],
    color: HAND_COLORS[i],
    sub: t(`${k}.sub` as `h1.sub` | `h2.sub` | `h3.sub`),
    title: t(`${k}.title` as `h1.title` | `h2.title` | `h3.title`),
    desc: t(`${k}.desc` as `h1.desc` | `h2.desc` | `h3.desc`),
    feats: [
      t(`${k}.f1` as `h1.f1` | `h2.f1` | `h3.f1`),
      t(`${k}.f2` as `h1.f2` | `h2.f2` | `h3.f2`),
      t(`${k}.f3` as `h1.f3` | `h2.f3` | `h3.f3`),
      t(`${k}.f4` as `h1.f4` | `h2.f4` | `h3.f4`),
    ],
  }))

  return (
    <section id="product" className="py-24">
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
          {hands.map((hand, i) => (
            <Reveal key={hand.sub} delay={i * 100}>
              <div className="rounded-[20px] border border-border bg-bg-card p-6 h-full flex flex-col">
                <div className="text-3xl mb-4">{hand.icon}</div>
                <div className="text-xs font-mono mb-2" style={{ color: hand.color }}>{hand.sub}</div>
                <div className="font-display text-xl text-text mb-3">{hand.title}</div>
                <p className="text-sm text-text-2 leading-relaxed mb-6 flex-1">{hand.desc}</p>
                <ul className="space-y-2">
                  {hand.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-amber mt-0.5">→</span>
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
