# ClawCross Website — Next.js Migration Design

**Date:** 2026-04-10
**Status:** Approved
**Author:** Claude + yangzhihong

---

## Context

The current site is a single `index.html` file (~1200 lines) with hand-rolled CSS, vanilla JS i18n, and scroll animations. The goal is to migrate it to a production-grade Next.js codebase deployed on Vercel, with room to grow into blog, docs, pricing, and download pages.

---

## Chosen Approach: App Router + next-intl + MDX

**Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- next-intl (server-side i18n)
- MDX (blog + docs content)
- Vercel (deployment)

---

## Directory Structure

```
app/
  [locale]/
    layout.tsx              # Root layout — Nav, Footer, NextIntlClientProvider
    page.tsx                # Landing page
    download/page.tsx       # Product download page
    pricing/page.tsx        # Pricing page
    blog/
      page.tsx              # Blog listing
      [slug]/page.tsx       # MDX blog post
    docs/
      page.tsx              # Docs home
      [...slug]/page.tsx    # MDX doc pages

components/
  nav/                      # Navbar with locale switcher
  footer/
  home/                     # One component per landing page section
    HeroSection.tsx
    StatsBar.tsx
    HandsSection.tsx
    PipelineSection.tsx
    SkillsSection.tsx
    ModesSection.tsx
    EcoSection.tsx
    ConnectorsSection.tsx
    CtaSection.tsx
    ChatDemo.tsx             # 'use client' — animated chat
  ui/                       # Button, Card, Badge, etc.

content/
  blog/zh/  & blog/en/      # MDX blog posts
  docs/zh/  & docs/en/      # MDX documentation

messages/
  zh.json                   # Migrated from T.zh in index.html
  en.json                   # Migrated from T.en in index.html

lib/
  mdx.ts                    # MDX file reading + frontmatter parsing

styles/
  globals.css               # Tailwind base + CSS custom properties

middleware.ts               # next-intl locale detection + redirect
tailwind.config.ts
next.config.ts
```

---

## Routing

| URL | Page |
|-----|------|
| `/` | 301 → `/zh` |
| `/zh`, `/en` | Landing page |
| `/zh/download`, `/en/download` | Download page |
| `/zh/pricing`, `/en/pricing` | Pricing page |
| `/zh/blog`, `/en/blog` | Blog listing |
| `/zh/blog/[slug]` | Blog post (MDX) |
| `/zh/docs`, `/en/docs` | Docs home |
| `/zh/docs/[...slug]` | Docs page (MDX) |

---

## Styling

Existing CSS custom properties are mapped to Tailwind config tokens:

```ts
// tailwind.config.ts
colors: {
  amber: { DEFAULT: '#C07838', light: '#D4904A' },
  bg:    { DEFAULT: '#0B0906', card: '#131009', elevated: '#1C1810' },
  text:  { DEFAULT: '#FAF9F6', 2: '#C8C2B8', muted: '#7D7568', dim: '#48433C' },
}
```

Visual design (dark amber aesthetic, grain overlay, typography) is preserved exactly.

---

## i18n Architecture

- `middleware.ts` detects locale from URL → `Accept-Language` → default `zh`
- `app/[locale]/layout.tsx` wraps with `NextIntlClientProvider`
- Server Components use `import { useTranslations } from 'next-intl'`
- Client Components (`ChatDemo`) also use `useTranslations` via next-intl's client hook
- Locale switcher in Nav: `<Link href={/${otherLocale}${pathname}}>` — no JS cost
- `messages/zh.json` and `messages/en.json` are direct migrations of the existing `T.zh` / `T.en` objects

---

## Component Strategy

| Component | Type | Reason |
|-----------|------|--------|
| All Section components | Server Component | SEO, no interactivity needed |
| `ChatDemo` | Client Component (`'use client'`) | Needs `setTimeout`, DOM animation |
| Locale switcher in Nav | Client Component | Needs `usePathname()` |
| MDX pages | Server Component | Static content |

Scroll-reveal animations: `useInView` hook pattern using Intersection Observer, extracted into a `useReveal` custom hook shared across sections.

---

## Out of Scope (this iteration)

- Headless CMS (add later if content team grows)
- Auth / user accounts
- Analytics integration (add post-launch)
