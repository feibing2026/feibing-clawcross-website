'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface ChatMessage {
  role: 'ai' | 'user'
  text: string
  tags?: string[]
  delay: number
}

export function ChatDemo() {
  const t = useTranslations('chat')
  const termTitle = t('termTitle')
  const allMessages = t.raw('messages') as ChatMessage[]

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    setMessages([])
    setTyping(false)
    const timers: ReturnType<typeof setTimeout>[] = []

    allMessages.forEach((msg) => {
      // Show typing indicator 400ms before message appears
      timers.push(
        setTimeout(() => setTyping(true), Math.max(0, msg.delay - 400))
      )
      timers.push(
        setTimeout(() => {
          setTyping(false)
          setMessages((prev) => [...prev, msg])
        }, msg.delay)
      )
    })

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  return (
    <div className="rounded-[20px] border border-border bg-bg-card overflow-hidden w-full max-w-[440px] shadow-2xl">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-elevated">
        <div className="flex gap-1.5">
          {(['#B83C2F', '#BE8420', '#3E8A58'] as const).map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="ml-2 text-xs text-text-muted font-mono truncate">{termTitle}</span>
      </div>

      {/* Messages */}
      <div className="p-4 flex flex-col gap-3 min-h-[220px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1.5 transition-all duration-300 opacity-100 ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`text-sm px-4 py-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.role === 'ai'
                  ? 'bg-bg-elevated text-text-2 rounded-tl-sm'
                  : 'bg-amber text-bg font-medium rounded-tr-sm'
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            {msg.tags && msg.role === 'ai' && (
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {msg.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-amber border border-amber/30 rounded px-2 py-0.5"
                    style={{ background: 'rgba(192,120,56,0.08)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-1 px-4 py-3 bg-bg-elevated rounded-2xl rounded-tl-sm w-fit">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
