import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getMdxListing } from '@/lib/mdx'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = await getMdxListing('blog', locale)

  return (
    <main className="pt-[62px] max-w-site mx-auto px-8 md:px-12 py-24">
      <div className="text-xs font-mono text-amber uppercase tracking-widest mb-4">
        {locale === 'zh' ? '博客' : 'Blog'}
      </div>
      <h1 className="font-display text-5xl text-text mb-12">
        {locale === 'zh' ? '最新文章' : 'Latest Posts'}
      </h1>
      <div className="space-y-4">
        {posts.map(({ slug, frontmatter }) => (
          <Link
            key={slug}
            href={`/${locale}/blog/${slug}`}
            className="block p-6 rounded-[16px] border border-border bg-bg-card hover:border-amber/40 transition-colors"
          >
            <div className="font-medium text-text mb-1">{frontmatter.title}</div>
            {frontmatter.description && (
              <div className="text-sm text-text-muted mb-2">{frontmatter.description}</div>
            )}
            <div className="text-xs text-text-dim">{frontmatter.date} · {locale === 'zh' ? '阅读全文 →' : 'Read more →'}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
