import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

const STATUS_COLORS = {
  active:  { dot: '#3E8A58', bg: 'rgba(62,138,88,0.1)', border: 'rgba(62,138,88,0.3)' },
  beta:    { dot: '#BE8420', bg: 'rgba(190,132,32,0.1)', border: 'rgba(190,132,32,0.3)' },
  coming:  { dot: '#7D7568', bg: 'rgba(125,117,104,0.08)', border: 'rgba(125,117,104,0.2)' },
}

export function ConnectorsSection() {
  const t = useTranslations('conn')
  const cards = t.raw('cards') as { n: string; s: 'active' | 'beta' | 'coming'; t: string; d: string; r: string[] }[]
  const status = t.raw('status') as Record<string, string>

  return (
    <section id="connectors" className="py-24 bg-bg-card/30">
      <div className="max-w-site mx-auto px-8 md:px-12">
        <Reveal className="text-center mb-12">
          <div className="text-xs font-mono text-amber uppercase tracking-widest mb-3">{t('eyebrow')}</div>
          <h2
            className="font-display text-4xl md:text-5xl text-text mb-4"
            dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
          />
          <p className="text-text-2 max-w-2xl mx-auto">{t('desc')}</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const sc = STATUS_COLORS[card.s]
            return (
              <Reveal key={card.n} delay={i * 60}>
                <div className="rounded-[16px] border border-border bg-bg-card p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text">{card.n}</span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.dot }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                      {status[card.s]}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">{card.t}</div>
                  <div className="text-xs text-text-muted leading-relaxed flex-1">{card.d}</div>
                  <div className="flex flex-wrap gap-1">
                    {card.r.map((region) => (
                      <span
                        key={region}
                        className="text-[10px] border border-border rounded px-1.5 py-0.5 text-text-dim"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
