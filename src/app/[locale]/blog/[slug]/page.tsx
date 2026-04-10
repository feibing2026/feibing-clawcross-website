import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMdxFiles, getMdxContent } from '@/lib/mdx'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getMdxFiles('blog', locale).map((f) => ({
      locale,
      slug: f.replace('.mdx', ''),
    }))
  )
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const result = getMdxContent('blog', locale, slug)
  if (!result) notFound()

  return (
    <main className="pt-[62px] max-w-[720px] mx-auto px-6 py-24">
      <h1 className="font-display text-4xl text-text mb-4">{result.frontmatter.title}</h1>
      <div className="text-sm text-text-muted mb-12">{String(result.frontmatter.date)}</div>
      <article
        className="prose prose-invert text-text-2 max-w-none"
        dangerouslySetInnerHTML={{ __html: result.content }}
      />
    </main>
  )
}
