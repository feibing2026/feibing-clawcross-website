'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    const lang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh'
    router.replace(`/${lang}`)
  }, [router])
  return null
}
