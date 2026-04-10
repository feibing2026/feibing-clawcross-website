# Next.js Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate ClawCross from a single `index.html` to a production-grade Next.js App Router site deployable to both Vercel and GitHub Pages.

**Architecture:** App Router with `[locale]` dynamic segment powered by next-intl. `output: 'export'` enables pure static generation compatible with GitHub Pages. `localePrefix: 'always'` ensures every URL contains `/zh` or `/en` (required when middleware cannot run on static hosts). Each landing-page section is a Server Component (rendered at build time). Only interactive pieces (`ChatDemo`, locale switcher) are Client Components. Blog and docs use MDX files under `content/`.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind CSS · next-intl · MDX (`@next/mdx` + `gray-matter`) · Vercel + GitHub Pages

**Static export constraints:**
- `middleware.ts` is NOT used (not supported in static export) — locale detection via root `page.tsx` client-side redirect instead
- No API routes, no ISR
- `generateStaticParams` required on all `[locale]` and dynamic routes
- GitHub Actions workflow deploys `out/` directory to `gh-pages` branch

---

## Task 1: Bootstrap Next.js project

**Files:**
- Create: project root (replaces bare `index.html`)

**Step 1: Scaffold**
```bash
cd /Users/yangzhihong/git/feibing-clawcross-website_20260410
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```
Answer prompts: accept all defaults.

**Step 2: Install additional dependencies**
```bash
npm install next-intl gray-matter
npm install -D @types/mdx
```

**Step 3: Verify dev server starts**
```bash
npm run dev
```
Expected: server at http://localhost:3000 with default Next.js page.

**Step 4: Commit**
```bash
git add -A
git commit -m "feat: bootstrap Next.js 15 with TypeScript + Tailwind"
```

---

## Task 2: Configure Tailwind design tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Replace `tailwind.config.ts`**
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#C07838',
          light:   '#D4904A',
          glow:    'rgba(192,120,56,0.18)',
          subtle:  'rgba(192,120,56,0.08)',
          border:  'rgba(192,120,56,0.22)',
          strong:  'rgba(192,120,56,0.35)',
        },
        bg: {
          DEFAULT:  '#0B0906',
          card:     '#131009',
          elevated: '#1C1810',
        },
        text: {
          DEFAULT: '#FAF9F6',
          2:       '#C8C2B8',
          muted:   '#7D7568',
          dim:     '#48433C',
        },
        border: {
          DEFAULT: 'rgba(192,120,56,0.13)',
          strong:  'rgba(192,120,56,0.28)',
        },
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      maxWidth: { site: '1200px' },
      borderRadius: { card: '12px', 'card-lg': '20px' },
    },
  },
}
export default config
```

**Step 2: Replace `src/app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.032;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 300px 300px;
}
```

**Step 3: Type-check**
```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 4: Commit**
```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: map design tokens to Tailwind config"
```

---

## Task 3: Configure next-intl (static export mode)

> Static export (`output: 'export'`) means `middleware.ts` cannot run.
> We use `localePrefix: 'always'` so every URL has `/zh` or `/en`.
> Locale detection at root is a client-side redirect in `src/app/page.tsx`.

**Files:**
- Create: `messages/zh.json`
- Create: `messages/en.json`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- ~~Create: `middleware.ts`~~ — NOT needed for static export
- Modify: `next.config.ts`

**Step 1: Create `src/i18n/routing.ts`**
```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',   // required for static export — no middleware
})
```

**Step 2: Create `src/i18n/request.ts`**
```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

**Step 3: ~~Create `middleware.ts`~~ — SKIP (not supported in static export)**

**Step 4: Update `next.config.ts`**
```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'export',        // static export for GitHub Pages + Vercel
  trailingSlash: true,     // GitHub Pages needs trailing slashes
  images: { unoptimized: true }, // required for static export
  // MDX config added in Task 11
}

export default withNextIntl(nextConfig)
```

**Step 5: Create `messages/zh.json`**

Extract all content from the `T.zh` object in `index.html` and paste as valid JSON. The keys should mirror the existing structure:
```json
{
  "nav": {
    "product": "产品",
    "pipeline": "流水线",
    "skills": "技能",
    "integrations": "集成",
    "ecosystem": "生态",
    "docs": "文档",
    "signin": "登录",
    "cta": "申请内测 →"
  },
  "hero": {
    "badge": "内测开放中 · 2026年正式上线",
    "title": "每位卖家都值得拥有一位<em>世界级COO。</em>",
    "desc": "ClawCross 是专为跨境电商卖家打造的AI原生智能工作台。三种智能触手延伸至所有平台——让AI COO伙伴全天候运营你的生意。",
    "cta1": "申请内测 →",
    "cta2": "了解工作原理",
    "proof": "已有 <strong>500+ 卖家</strong> 加入内测等候名单",
    "termTitle": "ClawCross · 项目：宠物智能饮水机 · 美国"
  },
  "stats": {
    "l1": "平均营收增幅",
    "l2": "专项AI技能",
    "l3": "平台覆盖",
    "l4": "智能触手模式"
  }
}
```
*(Continue with all sections: hands, pipeline, skills, modes, eco, conn, cta, footer — mirror T.zh fully)*

**Step 6: Create `messages/en.json`** — same structure, from T.en in `index.html`.

**Step 7: Type-check**
```bash
npx tsc --noEmit
```

**Step 8: Commit**
```bash
git add messages/ middleware.ts next.config.ts src/i18n/
git commit -m "feat: add next-intl routing, middleware, and translation messages"
```

---

## Task 4: App Router shell — `[locale]` layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx` (make it a minimal shell — delegate to `[locale]/layout.tsx`)

**Step 1: Update root `src/app/layout.tsx`**
```tsx
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
```

**Step 2: Create `src/app/[locale]/layout.tsx`**
```tsx
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'zh' | 'en')) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} className="scroll-smooth">
      <body className="font-sans bg-bg text-text antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Step 3: Create `src/app/[locale]/page.tsx`** (stub)
```tsx
export default function HomePage() {
  return <main><h1 className="text-amber text-4xl p-8">ClawCross</h1></main>
}
```

**Step 4: Build check**
```bash
npm run build
```
Expected: build succeeds, `[locale]` pages generated for `zh` and `en`.

**Step 5: Commit**
```bash
git add src/app/
git commit -m "feat: add [locale] layout with NextIntlClientProvider"
```

---

## Task 5: ClawCross logo + Nav component

**Files:**
- Create: `src/components/nav/ClawLogo.tsx`
- Create: `src/components/nav/LocaleSwitcher.tsx`
- Create: `src/components/nav/Nav.tsx`

**Step 1: Create `src/components/nav/ClawLogo.tsx`**
```tsx
export function ClawLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path d="M5 25Q7 18 9 10Q10 6 13 4" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M11 27Q13 20 14 12Q15 8 18 6" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round" opacity="0.8"/>
      <path d="M17 27Q19 21 20 14Q21 10 24 8" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round" opacity="0.55"/>
      <circle cx="5" cy="25" r="2.2" fill="#C07838"/>
    </svg>
  )
}
```

**Step 2: Create `src/components/nav/LocaleSwitcher.tsx`** (Client Component)
```tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(next: string) {
    // Replace /zh/ or /en/ prefix in pathname
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 border border-border rounded-full px-3 py-1 text-sm">
      <button
        onClick={() => switchTo('zh')}
        className={locale === 'zh' ? 'text-amber font-medium' : 'text-text-muted hover:text-text-2'}
      >
        中文
      </button>
      <span className="text-border-strong">|</span>
      <button
        onClick={() => switchTo('en')}
        className={locale === 'en' ? 'text-amber font-medium' : 'text-text-muted hover:text-text-2'}
      >
        EN
      </button>
    </div>
  )
}
```

**Step 3: Create `src/components/nav/Nav.tsx`**
```tsx
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ClawLogo } from './ClawLogo'
import { LocaleSwitcher } from './LocaleSwitcher'

export async function Nav() {
  const t = useTranslations('nav')
  const locale = await getLocale()

  const links = [
    { key: 'product',      href: '#product' },
    { key: 'pipeline',     href: '#pipeline' },
    { key: 'skills',       href: '#skills' },
    { key: 'integrations', href: '#connectors' },
    { key: 'ecosystem',    href: '#ecosystem' },
    { key: 'docs',         href: `/${locale}/docs` },
  ] as const

  return (
    <nav className="fixed inset-x-0 top-0 z-[900] h-[62px] px-12 flex items-center justify-between bg-bg/72 backdrop-blur-xl border-b border-border">
      <Link href={`/${locale}`} className="flex items-center gap-2.5 text-text no-underline">
        <ClawLogo />
        <span className="font-display text-xl tracking-tight">
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
        <a href="#" className="text-sm text-text-muted hover:text-text">{t('signin')}</a>
        <a href="#cta" className="text-sm bg-amber text-bg px-4 py-2 rounded-full font-medium hover:bg-amber-light transition-colors">
          {t('cta')}
        </a>
      </div>
    </nav>
  )
}
```

**Step 4: Add Nav to `[locale]/layout.tsx`**
```tsx
// Add import
import { Nav } from '@/components/nav/Nav'
// Wrap children:
<NextIntlClientProvider messages={messages}>
  <Nav />
  {children}
</NextIntlClientProvider>
```

**Step 5: Build check**
```bash
npm run build
```

**Step 6: Commit**
```bash
git add src/components/nav/
git commit -m "feat: add Nav with ClawLogo and LocaleSwitcher"
```

---

## Task 6: Footer component

**Files:**
- Create: `src/components/footer/Footer.tsx`

**Step 1: Create `src/components/footer/Footer.tsx`**
```tsx
import { useTranslations } from 'next-intl'
import { ClawLogo } from '@/components/nav/ClawLogo'

export function Footer() {
  const t = useTranslations('footer')

  const col1Links = ['功能特性','三种触手','16项AI技能','OpenClaw Cloud','定价','更新日志']
  // Use t() calls for the actual implementation — keys: footer.links1[0] etc.
  // For simplicity, keep static arrays per locale via t('links1') returning arrays

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-site mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClawLogo size={24} />
              <span className="font-display text-lg">Claw<b className="text-amber font-normal">Cross</b></span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{t('tagline')}</p>
          </div>
          {(['col1','col2','col3'] as const).map((col, i) => (
            <div key={col}>
              <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">{t(col)}</div>
              {/* links rendered from t(`links${i+1}`) */}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-xs text-text-dim gap-4">
          <span>{t('copy')}</span>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Add Footer to `[locale]/layout.tsx`** after `{children}`:
```tsx
import { Footer } from '@/components/footer/Footer'
// ...
<Nav />
{children}
<Footer />
```

**Step 3: Commit**
```bash
git add src/components/footer/
git commit -m "feat: add Footer component"
```

---

## Task 7: `useReveal` hook (scroll animation)

**Files:**
- Create: `src/hooks/useReveal.ts`
- Create: `src/components/ui/Reveal.tsx`

**Step 1: Create `src/hooks/useReveal.ts`**
```ts
'use client'
import { useEffect, useRef, useState } from 'react'

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, visible }
}
```

**Step 2: Create `src/components/ui/Reveal.tsx`**
```tsx
'use client'
import { useReveal } from '@/hooks/useReveal'
import type { ReactNode } from 'react'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  )
}
```

**Step 3: Commit**
```bash
git add src/hooks/ src/components/ui/
git commit -m "feat: add useReveal hook and Reveal wrapper component"
```

---

## Task 8: HeroSection + ChatDemo

**Files:**
- Create: `src/components/home/ChatDemo.tsx`
- Create: `src/components/home/HeroSection.tsx`

**Step 1: Create `src/components/home/ChatDemo.tsx`** (Client Component)

Port the chat animation logic from `index.html` script. Key behavior:
- Messages animate in sequence with delays
- Typing indicator shows between messages
- Tags render as amber pills beneath AI messages

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Message = { role: 'ai' | 'user'; text: string; tags?: string[]; delay: number }

export function ChatDemo() {
  const t = useTranslations('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)

  // t.raw('messages') returns the array from messages/zh.json or en.json
  const allMessages = t.raw('messages') as Message[]

  useEffect(() => {
    setMessages([])
    setTyping(false)
    const timers: ReturnType<typeof setTimeout>[] = []

    allMessages.forEach((msg, i) => {
      timers.push(setTimeout(() => {
        setTyping(true)
      }, msg.delay - 300))

      timers.push(setTimeout(() => {
        setTyping(false)
        setMessages(prev => [...prev, msg])
      }, msg.delay))
    })

    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  return (
    <div className="rounded-[20px] border border-border bg-bg-card overflow-hidden w-full max-w-[440px]">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-elevated">
        <div className="flex gap-1.5">
          {['#B83C2F','#BE8420','#3E8A58'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="ml-2 text-xs text-text-muted font-mono">{t('termTitle')}</span>
      </div>
      {/* Messages */}
      <div className="p-4 flex flex-col gap-3 min-h-[220px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`text-sm px-4 py-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
              msg.role === 'ai'
                ? 'bg-bg-elevated text-text-2 rounded-tl-sm'
                : 'bg-amber text-bg rounded-tr-sm'
            }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            {msg.tags && (
              <div className="flex gap-1.5 mt-1">
                {msg.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-amber border border-amber/30 rounded px-2 py-0.5 bg-amber/8">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 px-4 py-3 bg-bg-elevated rounded-2xl rounded-tl-sm w-fit">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Create `src/components/home/HeroSection.tsx`**
```tsx
import { useTranslations } from 'next-intl'
import { ChatDemo } from './ChatDemo'

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section className="pt-[62px] min-h-screen flex items-center">
      <div className="max-w-site mx-auto px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber border border-amber/30 rounded-full px-4 py-1.5 mb-8 bg-amber/8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            {t('badge')}
          </div>
          <h1
            className="font-display text-5xl lg:text-6xl leading-tight tracking-tight mb-6"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
          <p className="text-lg text-text-2 leading-relaxed mb-10 max-w-xl">{t('desc')}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#cta" className="bg-amber text-bg px-6 py-3 rounded-full font-medium hover:bg-amber-light transition-colors">
              {t('cta1')}
            </a>
            <a href="#pipeline" className="border border-border px-6 py-3 rounded-full text-text-2 hover:border-amber/40 transition-colors">
              {t('cta2')}
            </a>
          </div>
          <p className="text-sm text-text-muted mt-6" dangerouslySetInnerHTML={{ __html: t.raw('proof') }} />
        </div>
        <div className="flex justify-center">
          <ChatDemo />
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Add `messages.chat` key to `messages/zh.json` and `messages/en.json`**

In `zh.json` add under the root:
```json
"chat": {
  "termTitle": "ClawCross · 项目：宠物智能饮水机 · 美国",
  "messages": [
    { "role": "ai", "text": "早上好。竞品「SmartPaw Pro」昨晚在亚马逊美国市场降价18%。我已准备好三套应对方案。", "tags": ["数据分析","市场研究"], "delay": 800 },
    { "role": "user", "text": "给我看保守方案。", "delay": 2600 },
    { "role": "ai", "text": "保守方案：维持售价，将PPC预算提升15%，精准定向竞品ASIN。预计ACoS控制在22%以内。预估本周营收影响：<strong>+$340</strong>。", "tags": ["广告优化","定价策略"], "delay": 4200 }
  ]
}
```
*(Add equivalent English version to `en.json`)*

**Step 4: Wire HeroSection into `[locale]/page.tsx`**
```tsx
import { HeroSection } from '@/components/home/HeroSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  )
}
```

**Step 5: Build + visual check**
```bash
npm run build && npm run dev
```
Open http://localhost:3000 — verify hero renders with animated chat.

**Step 6: Commit**
```bash
git add src/components/home/ messages/
git commit -m "feat: add HeroSection and ChatDemo with i18n"
```

---

## Task 9: Remaining landing-page sections

Port each section from `index.html` to its own Server Component under `src/components/home/`. Follow the same pattern as HeroSection: use `useTranslations`, wrap animated elements in `<Reveal>`.

**Files to create:**
- `src/components/home/StatsBar.tsx`
- `src/components/home/HandsSection.tsx`
- `src/components/home/PipelineSection.tsx`
- `src/components/home/SkillsSection.tsx`
- `src/components/home/ModesSection.tsx`
- `src/components/home/EcoSection.tsx`
- `src/components/home/ConnectorsSection.tsx`
- `src/components/home/CtaSection.tsx`

**For each section:**

1. Create the component file, importing `useTranslations` and `Reveal`
2. Port HTML structure → JSX, converting class → className, style strings → Tailwind classes
3. Port dynamic content (skills pills, connector cards, mode features) as `.map()` over `t.raw(...)` arrays
4. Add section to `[locale]/page.tsx`
5. Verify no TypeScript errors: `npx tsc --noEmit`
6. Commit after each section:
   ```bash
   git commit -m "feat: add [SectionName] section"
   ```

**CtaSection specifics** — email submission needs a Client Component for the input + button:
- Create `src/components/home/CtaForm.tsx` as `'use client'`
- Handle `useState` for email value and success state
- Parent `CtaSection.tsx` stays a Server Component, embeds `<CtaForm />`

---

## Task 10: Stub pages — Download, Pricing, Blog, Docs

**Files:**
- Create: `src/app/[locale]/download/page.tsx`
- Create: `src/app/[locale]/pricing/page.tsx`
- Create: `src/app/[locale]/blog/page.tsx`
- Create: `src/app/[locale]/docs/page.tsx`

**Step 1: Create each page as a minimal stub**
```tsx
// src/app/[locale]/download/page.tsx
import { useTranslations } from 'next-intl'

export default function DownloadPage() {
  return (
    <main className="pt-[62px] max-w-site mx-auto px-12 py-24">
      <h1 className="font-display text-5xl text-amber mb-4">Download</h1>
      <p className="text-text-2">Coming soon.</p>
    </main>
  )
}
```
*(Repeat for pricing, blog, docs)*

**Step 2: Update Nav links to use `<Link>` for internal pages**

In `Nav.tsx`, change docs `href` to use Next.js `<Link>` for `/[locale]/docs`.

**Step 3: Build check**
```bash
npm run build
```

**Step 4: Commit**
```bash
git add src/app/
git commit -m "feat: add stub pages for download, pricing, blog, docs"
```

---

## Task 11: MDX setup for blog + docs

**Files:**
- Modify: `next.config.ts`
- Create: `src/lib/mdx.ts`
- Create: `content/blog/zh/hello-world.mdx`
- Create: `content/docs/zh/getting-started.mdx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/[locale]/docs/[...slug]/page.tsx`

**Step 1: Install MDX dependencies**
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

**Step 2: Update `next.config.ts`**
```ts
import createMDX from '@next/mdx'
// ...
const withMDX = createMDX({ options: { remarkPlugins: [], rehypePlugins: [] } })
export default withNextIntl(withMDX(nextConfig))
```

**Step 3: Create `src/lib/mdx.ts`**
```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'content')

export function getMdxFiles(type: 'blog' | 'docs', locale: string) {
  const dir = path.join(contentRoot, type, locale)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
}

export function getMdxContent(type: 'blog' | 'docs', locale: string, slug: string) {
  const filePath = path.join(contentRoot, type, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(raw)
  return { frontmatter, content }
}
```

**Step 4: Create sample `content/blog/zh/hello-world.mdx`**
```mdx
---
title: ClawCross 正式启航
date: 2026-04-10
description: 我们为什么要构建一个AI COO？
---

# ClawCross 正式启航

跨境电商卖家每天面对海量数据和决策……
```

**Step 5: Create `src/app/[locale]/blog/[slug]/page.tsx`**
```tsx
import { getMdxContent } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const result = getMdxContent('blog', locale, slug)
  if (!result) notFound()

  return (
    <main className="pt-[62px] max-w-[720px] mx-auto px-6 py-24">
      <h1 className="font-display text-4xl mb-8">{result.frontmatter.title as string}</h1>
      <article className="prose prose-invert prose-amber">
        {result.content}
      </article>
    </main>
  )
}
```

**Step 6: Build check**
```bash
npm run build
```

**Step 7: Commit**
```bash
git add content/ src/lib/ src/app/[locale]/blog/ src/app/[locale]/docs/ next.config.ts
git commit -m "feat: add MDX support for blog and docs with gray-matter"
```

---

## Task 12: Root redirect + metadata

**Files:**
- Modify: `src/app/page.tsx` (or create redirect)
- Modify: `src/app/[locale]/layout.tsx` (add metadata)

**Step 1: Root redirect in `src/app/page.tsx`**

Server-side `redirect()` doesn't work in static export. Use a client-side redirect instead:
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    // Detect browser language, default to zh
    const lang = navigator.language.startsWith('en') ? 'en' : 'zh'
    router.replace(`/${lang}`)
  }, [router])
  return null
}
```

**Step 2: Add metadata to `[locale]/layout.tsx`**
```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'zh'
      ? 'ClawCross — 跨境电商AI智能工作台'
      : 'ClawCross — AI-Native Cross-Border Commerce',
    description: locale === 'zh'
      ? 'ClawCross 是专为跨境电商卖家打造的AI原生智能工作台。'
      : 'ClawCross is the AI-native workbench for cross-border e-commerce sellers.',
    metadataBase: new URL('https://clawcross.com'),
    openGraph: {
      siteName: 'ClawCross',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  }
}
```

**Step 3: Commit**
```bash
git add src/app/
git commit -m "feat: root redirect to /zh and per-locale metadata"
```

---

## Task 13: GitHub Actions + Deploy

### GitHub Pages via GitHub Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Step 2: Enable GitHub Pages**
- Go to repo Settings → Pages
- Source: **GitHub Actions**

**Step 3: Push and verify**
```bash
git push origin main
```
Watch Actions tab — job should pass and site appears at `https://feibing2026.github.io/feibing-clawcross-website/` (or custom domain if DNS is set).

### Vercel Deploy

**Step 4: Import on Vercel**
- Go to https://vercel.com/new
- Import `feibing2026/feibing-clawcross-website`
- Framework: Next.js (auto-detected), Root: `.`
- No env vars needed

**Step 5: Custom domain**
- Vercel project → Domains → add `clawcross.com` + `www.clawcross.com`
- GitHub Pages: repo Settings → Pages → Custom domain → `clawcross.com`
- At DNS registrar: CNAME `www` → `feibing2026.github.io` (or Vercel's target)

**Step 6: Commit the workflow**
```bash
git add .github/
git commit -m "feat: add GitHub Actions deploy to GitHub Pages"
git push origin main
```

---

## Cleanup

After all tasks pass:

```bash
# Remove the original index.html (content fully migrated)
git rm index.html
git commit -m "chore: remove legacy index.html, fully migrated to Next.js"
git push origin main
```
