import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const contentRoot = path.join(process.cwd(), 'content')

export interface MdxFrontmatter {
  title: string
  date: string
  description?: string
}

export function getMdxFiles(type: 'blog' | 'docs', locale: string): string[] {
  const dir = path.join(contentRoot, type, locale)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

export async function getMdxContent(
  type: 'blog' | 'docs',
  locale: string,
  slug: string
): Promise<{ frontmatter: MdxFrontmatter; html: string } | null> {
  const filePath = path.join(contentRoot, type, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const processed = await remark().use(remarkHtml).process(content)
  return {
    frontmatter: { ...data, date: String(data.date) } as MdxFrontmatter,
    html: processed.toString(),
  }
}

export async function getMdxListing(
  type: 'blog' | 'docs',
  locale: string
): Promise<{ slug: string; frontmatter: MdxFrontmatter }[]> {
  const files = getMdxFiles(type, locale)
  const items = await Promise.all(
    files.map(async (f) => {
      const slug = f.replace('.mdx', '')
      const result = await getMdxContent(type, locale, slug)
      return result ? { slug, frontmatter: result.frontmatter } : null
    })
  )
  return items.filter(Boolean) as { slug: string; frontmatter: MdxFrontmatter }[]
}
