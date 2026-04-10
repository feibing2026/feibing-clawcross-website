import { useTranslations } from 'next-intl'
import { CtaForm } from './CtaForm'

export function CtaSection() {
  const t = useTranslations('cta')

  return (
    <section id="cta" className="py-32 relative overflow-hidden">
      {/* Amber glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(192,120,56,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-[600px] mx-auto px-8 text-center">
        <div className="text-xs font-mono text-amber uppercase tracking-widest mb-6">{t('eyebrow')}</div>
        <h2
          className="font-display text-5xl text-text mb-6 leading-tight"
          dangerouslySetInnerHTML={{ __html: t.raw('title') as string }}
        />
        <p className="text-text-2 mb-10">{t('desc')}</p>
        <CtaForm />
        <p className="text-xs text-text-dim mt-4">{t('note')}</p>
      </div>
    </section>
  )
}
