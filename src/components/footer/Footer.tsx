import { useTranslations } from 'next-intl'
import { ClawLogo } from '@/components/nav/ClawLogo'

export function Footer() {
  const t = useTranslations('footer')
  const links1 = t.raw('links1') as string[]
  const links2 = t.raw('links2') as string[]
  const links3 = t.raw('links3') as string[]
  const legal  = t.raw('legal')  as string[]

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-site mx-auto px-8 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClawLogo size={24} />
              <span className="font-display text-lg text-text">
                Claw<b className="text-amber font-normal">Cross</b>
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-6">{t('tagline')}</p>
            <div className="flex gap-3">
              {['𝕏', 'in', '✉'].map((icon) => (
                <a key={icon} href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:border-amber/40 hover:text-amber transition-colors text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { col: 'col1' as const, links: links1 },
            { col: 'col2' as const, links: links2 },
            { col: 'col3' as const, links: links3 },
          ].map(({ col, links }) => (
            <div key={col}>
              <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                {t(col)}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-muted hover:text-text-2 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-xs text-text-dim gap-4">
          <span>{t('copy')}</span>
          <div className="flex gap-6">
            {legal.map((item) => (
              <a key={item} href="#" className="hover:text-text-muted transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
