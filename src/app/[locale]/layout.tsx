import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { DM_Serif_Display, Outfit, JetBrains_Mono } from 'next/font/google'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/footer/Footer'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  return {
    title: isZh ? 'ClawCross — 跨境电商AI智能工作台' : 'ClawCross — AI-Native Cross-Border Commerce',
    description: isZh
      ? 'ClawCross 是专为跨境电商卖家打造的AI原生智能工作台。三种智能触手，16项AI技能，你的专属AI COO。'
      : 'ClawCross is the AI-native workbench for cross-border e-commerce. Three intelligent hands, 16 AI skills, your AI COO.',
    metadataBase: new URL('https://clawcross.com'),
    openGraph: {
      siteName: 'ClawCross',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Required for static export: tells next-intl the locale without using headers()
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      className={`${dmSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="font-sans bg-bg text-text antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <Nav locale={locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
