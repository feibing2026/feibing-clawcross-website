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
  const result = await getMdxContent('blog', locale, slug)
  if (!result) notFound()

  return (
    <main className="pt-[62px] max-w-[720px] mx-auto px-6 py-24">
      <h1 className="font-display text-4xl text-text mb-4">{result.frontmatter.title}</h1>
      <div className="text-sm text-text-muted mb-12">{result.frontmatter.date}</div>
      <article
        className="text-text-2 leading-relaxed max-w-none space-y-4
          [&_h1]:font-display [&_h1]:text-3xl [&_h1]:text-text [&_h1]:mt-8 [&_h1]:mb-4
          [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-text [&_h2]:mt-6 [&_h2]:mb-3
          [&_p]:text-text-2 [&_p]:leading-relaxed
          [&_a]:text-amber [&_a]:underline [&_a]:underline-offset-2
          [&_strong]:text-text [&_strong]:font-semibold
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
          [&_code]:font-mono [&_code]:text-sm [&_code]:bg-bg-elevated [&_code]:px-1 [&_code]:rounded
          [&_pre]:bg-bg-elevated [&_pre]:p-4 [&_pre]:rounded-[12px] [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: result.html }}
      />
    </main>
  )
}
