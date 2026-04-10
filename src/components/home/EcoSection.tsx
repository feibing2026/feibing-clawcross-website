import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

export function EcoSection() {
  const t = useTranslations('eco')
  const cards = t.raw('cards') as { e: string; t: string; d: string }[]

  return (
    <section id="ecosystem" className="py-24">
      <div className="max-w-site mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <Reveal>
            <div className="text-xs font-mono text-amber uppercase tracking-widest mb-3">{t('eyebrow')}</div>
            <h2
              className="font-display text-4xl md:text-5xl text-text mb-4"
              dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
            />
            <p className="text-text-2 mb-8">{t('desc')}</p>
            <div className="space-y-5">
              {(['f1', 'f2', 'f3'] as const).map((k) => (
                <div key={k} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-lg shrink-0">
                    {k === 'f1' ? '🛒' : k === 'f2' ? '👨‍💻' : '🧩'}
                  </div>
                  <div>
                    <div className="font-medium text-text mb-1">
                      {t(`${k}.name` as `f1.name` | `f2.name` | `f3.name`)}
                    </div>
                    <div className="text-sm text-text-muted">
                      {t(`${k}.desc` as `f1.desc` | `f2.desc` | `f3.desc`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: agent cards */}
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <div
                  key={card.t}
                  className="rounded-[16px] border border-border bg-bg-card p-4 hover:border-amber/30 transition-colors"
                >
                  <div className="text-2xl mb-2">{card.e}</div>
                  <div className="text-sm font-medium text-text mb-1">{card.t}</div>
                  <div className="text-xs text-text-muted leading-relaxed">{card.d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
