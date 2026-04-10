import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'content')

export interface MdxFrontmatter {
  title: string
  date: string | Date
  description?: string
}

export function getMdxFiles(type: 'blog' | 'docs', locale: string): string[] {
  const dir = path.join(contentRoot, type, locale)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

export function getMdxContent(
  type: 'blog' | 'docs',
  locale: string,
  slug: string
): { frontmatter: MdxFrontmatter; content: string } | null {
  const filePath = path.join(contentRoot, type, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data as MdxFrontmatter, content }
}
