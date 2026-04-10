import { useTranslations } from 'next-intl'
import { ChatDemo } from './ChatDemo'
import { Reveal } from '@/components/ui/Reveal'

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section className="pt-[62px] min-h-screen flex items-center relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(192,120,56,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-site mx-auto px-8 md:px-12 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <Reveal>
          <div
            className="inline-flex items-center gap-2 text-xs font-mono text-amber border border-amber/30 rounded-full px-4 py-1.5 mb-8"
            style={{ background: 'rgba(192,120,56,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            {t('badge')}
          </div>

          <h1
            className="font-display text-5xl lg:text-6xl leading-tight tracking-tight text-text mb-6"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />

          <p className="text-lg text-text-2 leading-relaxed mb-10 max-w-xl">
            {t('desc')}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="#cta"
              className="bg-amber text-bg px-6 py-3 rounded-full font-medium hover:bg-amber-light transition-colors"
            >
              {t('cta1')}
            </a>
            <a
              href="#pipeline"
              className="border border-border px-6 py-3 rounded-full text-text-2 hover:border-amber/40 hover:text-text transition-colors"
            >
              {t('cta2')}
            </a>
          </div>

          <p
            className="text-sm text-text-muted"
            dangerouslySetInnerHTML={{ __html: t.raw('proof') }}
          />
        </Reveal>

        {/* Right: Chat demo */}
        <Reveal delay={200} className="flex justify-center lg:justify-end">
          <ChatDemo />
        </Reveal>
      </div>
    </section>
  )
}
