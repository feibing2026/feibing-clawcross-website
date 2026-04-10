import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

export function PipelineSection() {
  const t = useTranslations('pipeline')

  const stages = (['s1', 's2', 's3', 's4', 's5'] as const).map((k, i) => ({
    num: i + 1,
    e: t(`${k}.e` as `s1.e` | `s2.e` | `s3.e` | `s4.e` | `s5.e`),
    n: t(`${k}.n` as `s1.n` | `s2.n` | `s3.n` | `s4.n` | `s5.n`),
    d: t(`${k}.d` as `s1.d` | `s2.d` | `s3.d` | `s4.d` | `s5.d`),
    g: t(`${k}.g` as `s1.g` | `s2.g` | `s3.g` | `s4.g` | `s5.g`),
  }))

  return (
    <section id="pipeline" className="py-24 bg-bg-card/30">
      <div className="max-w-site mx-auto px-8 md:px-12">
        <Reveal className="text-center mb-16">
          <div className="text-xs font-mono text-amber uppercase tracking-widest mb-3">{t('eyebrow')}</div>
          <h2
            className="font-display text-4xl md:text-5xl text-text mb-4"
            dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
          />
          <p className="text-text-2 max-w-2xl mx-auto">{t('desc')}</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="relative rounded-[16px] border border-border bg-bg-card p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center text-xs font-mono text-amber">
                    {s.num}
                  </div>
                  <span className="text-xs font-mono text-amber">{s.e}</span>
                </div>
                <div className="font-medium text-text text-sm">{s.n}</div>
                <p className="text-xs text-text-muted leading-relaxed flex-1">{s.d}</p>
                <div className="text-[10px] font-mono text-text-dim border border-border rounded px-2 py-1 mt-auto">
                  {s.g}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
