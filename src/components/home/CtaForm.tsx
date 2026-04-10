'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function CtaForm() {
  const t = useTranslations('cta')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-amber font-medium text-lg">{t('success')}</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('placeholder')}
        className="flex-1 max-w-xs bg-bg-elevated border border-border rounded-full px-5 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-amber/60 transition-colors"
        required
      />
      <button
        type="submit"
        className="bg-amber text-bg px-6 py-3 rounded-full font-medium text-sm hover:bg-amber-light transition-colors whitespace-nowrap"
      >
        {t('btn')}
      </button>
    </form>
  )
}
