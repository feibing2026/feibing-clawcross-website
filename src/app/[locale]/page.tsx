import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/home/HeroSection'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <HeroSection />
    </main>
  )
}
