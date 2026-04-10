import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function DocsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="pt-[62px] max-w-site mx-auto px-8 md:px-12 py-24">
      <div className="text-xs font-mono text-amber uppercase tracking-widest mb-4">Docs</div>
      <h1 className="font-display text-5xl text-text mb-6">
        {locale === 'zh' ? '文档' : 'Docs'}
      </h1>
      <p className="text-text-muted">
        {locale === 'zh' ? '产品即将发布，敬请期待。' : 'Product launching soon. Stay tuned.'}
      </p>
    </main>
  )
}
