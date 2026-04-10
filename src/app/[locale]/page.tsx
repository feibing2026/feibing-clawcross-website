import { setRequestLocale } from 'next-intl/server'
import { HeroSection }       from '@/components/home/HeroSection'
import { StatsBar }          from '@/components/home/StatsBar'
import { HandsSection }      from '@/components/home/HandsSection'
import { PipelineSection }   from '@/components/home/PipelineSection'
import { SkillsSection }     from '@/components/home/SkillsSection'
import { ModesSection }      from '@/components/home/ModesSection'
import { EcoSection }        from '@/components/home/EcoSection'
import { ConnectorsSection } from '@/components/home/ConnectorsSection'
import { CtaSection }        from '@/components/home/CtaSection'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <HeroSection />
      <StatsBar />
      <HandsSection />
      <PipelineSection />
      <SkillsSection />
      <ModesSection />
      <EcoSection />
      <ConnectorsSection />
      <CtaSection />
    </main>
  )
}
