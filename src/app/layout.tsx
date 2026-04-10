import type { ReactNode } from 'react'
import { DM_Serif_Display, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${dmSerif.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-bg text-text antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
