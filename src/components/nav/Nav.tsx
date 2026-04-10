import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ClawLogo } from './ClawLogo'
import { LocaleSwitcher } from './LocaleSwitcher'

type Props = { locale: string }

export function Nav({ locale }: Props) {
  const t = useTranslations('nav')

  const links = [
    { key: 'product' as const,      href: '#product' },
    { key: 'pipeline' as const,     href: '#pipeline' },
    { key: 'skills' as const,       href: '#skills' },
    { key: 'integrations' as const, href: '#connectors' },
    { key: 'ecosystem' as const,    href: '#ecosystem' },
    { key: 'docs' as const,         href: `/${locale}/docs` },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-[900] h-[62px] px-8 md:px-12 flex items-center justify-between bg-bg/70 backdrop-blur-xl border-b border-border">
      <Link href={`/${locale}`} className="flex items-center gap-2.5 no-underline">
        <ClawLogo />
        <span className="font-display text-xl tracking-tight text-text">
          Claw<b className="text-amber font-normal">Cross</b>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {links.map(({ key, href }) => (
          <a key={key} href={href} className="text-sm text-text-muted hover:text-text transition-colors">
            {t(key)}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <a href="#" className="text-sm text-text-muted hover:text-text hidden md:block">
          {t('signin')}
        </a>
        <a
          href="#cta"
          className="text-sm bg-amber text-bg px-4 py-2 rounded-full font-medium hover:bg-amber-light transition-colors"
        >
          {t('cta')}
        </a>
      </div>
    </nav>
  )
}
