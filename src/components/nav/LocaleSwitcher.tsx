'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(next: string) {
    // Replace /zh or /en prefix in pathname
    const newPath = pathname.replace(new RegExp(`^/${locale}`), `/${next}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 border border-border rounded-full px-3 py-1 text-sm">
      <button
        onClick={() => switchTo('zh')}
        className={`transition-colors ${locale === 'zh' ? 'text-amber font-medium' : 'text-text-muted hover:text-text-2'}`}
      >
        中文
      </button>
      <span className="text-text-dim">|</span>
      <button
        onClick={() => switchTo('en')}
        className={`transition-colors ${locale === 'en' ? 'text-amber font-medium' : 'text-text-muted hover:text-text-2'}`}
      >
        EN
      </button>
    </div>
  )
}
