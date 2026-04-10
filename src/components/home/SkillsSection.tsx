import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

const CATEGORY_COLORS: Record<string, string> = {
  discover: '#C07838',
  source:   '#BE8420',
  launch:   '#3E8A58',
  publish:  '#7868A8',
  optimize: '#4878AC',
  protect:  '#B83C2F',
}

export function SkillsSection() {
  const t = useTranslations('skills')
  const pills = t.raw('pills') as { e: string; n: string; p: string; c: string }[]

  return (
    <section id="skills" className="py-24">
      <div className="max-w-site mx-auto px-8 md:px-12">
        <Reveal className="text-center mb-12">
          <div className="text-xs font-mono text-amber uppercase tracking-widest mb-3">{t('eyebrow')}</div>
          <h2
            className="font-display text-4xl md:text-5xl text-text mb-4"
            dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
          />
          <p className="text-text-2 max-w-2xl mx-auto">{t('desc')}</p>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap gap-3 justify-center">
            {pills.map((pill) => {
              const color = CATEGORY_COLORS[pill.c] ?? '#C07838'
              return (
                <div
                  key={pill.n}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
                  style={{
                    borderColor: `${color}40`,
                    background: `${color}10`,
                    color,
                  }}
                >
                  <span>{pill.e}</span>
                  <span className="text-text-2 font-medium text-xs">{pill.n}</span>
                  <span className="text-[10px] opacity-60 font-mono">{pill.p}</span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
