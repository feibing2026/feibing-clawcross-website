'use client'

import { useEffect } from 'react'

export function LangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])
  return null
}
