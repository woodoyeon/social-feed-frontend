// src/app/messages/MessagesClient.tsx
'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Msg = { from: 'me' | 'jimin' | 'seojun'; text: string; time: string }

const mockUsers = [
  { id: 1, name: '지민', username: 'jimin', profileImage: 'https://picsum.photos/40?random=301', lastMsg: '요즘 어떻게 지내?', unread: 2 },
  { id: 2, name: '서준', username: 'seojun', profileImage: 'https://picsum.photos/40?random=302', lastMsg: '내일 점심 괜찮아?', unread: 0 },
]

const seedMessages: Record<number, Msg[]> = {
  1: [
    { from: 'jimin', text: '요즘 어떻게 지내?', time: '10:30' },
    { from: 'me', text: '나 잘 지내! 사이드 프로젝트 하고 있어 🚀', time: '10:32' },
  ],
  2: [
    { from: 'seojun', text: '내일 점심 괜찮아?', time: '09:12' },
    { from: 'me', text: '좋지! 회사 근처에서 보자 😊', time: '09:14' },
  ],
}

export default function MessagesClient() {
  const [activeChat, setActiveChat] = useState<number>(1)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Record<number, Msg[]>>(() => ({ ...seedMessages }))
  const users = useMemo(() => mockUsers, [])

  const onSend = () => {
    const value = text.trim()
    if (!value) return
    setMessages(prev => {
      const next = { ...prev }
      const list = next[activeChat] ? [...next[activeChat]] : []
      list.push({ from: 'me', text: value, time: '지금' })
      next[activeChat] = list
      return next
    })
    setText('')
  }

  return (
    <div className="flex h-[75vh] border-b border-divider">
      {/* 좌측: 대화 목록 */}
      <aside className="w-1/3 min-w-[180px] max-w-[240px] border-r border-divider bg-surface">
        <div role="list" aria-label="대화 목록">
          {users.map(u => {
            const active = activeChat === u.id
            return (
              <button
                key={u.id}
                onClick={() => setActiveChat(u.id)}
                className={cn(
                  'w-full text-left flex items-center gap-3 p-3 hover:bg-surface-2 transition-colors',
                  active && 'bg-surface-2'
                )}
              >
                <img src={u.profileImage} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{u.name}</p>
                  <p className="text-sm text-muted truncate">{u.lastMsg}</p>
                </div>
                {u.unread > 0 && (
                  <span className="ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {u.unread > 99 ? '99+' : u.unread}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* 우측: 채팅창 */}
      <section className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(messages[activeChat] ?? []).map((m, i) => {
            const mine = m.from === 'me'
            return (
              <div key={`${activeChat}-${i}`} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'px-3 py-2 rounded-2xl max-w-[70%] break-words',
                    mine ? 'bg-blue-500 text-white' : 'bg-surface-2 text-foreground'
                  )}
                >
                  <div className="leading-6 whitespace-pre-wrap">{m.text}</div>
                  <div className="mt-1 text-xs opacity-70 text-right">{m.time}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 입력창 */}
        <div className="p-3 border-t border-divider flex gap-2">
          <Input
            placeholder="메시지를 입력하세요…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSend()
            }}
            aria-label="메시지 입력"
          />
          <Button onClick={onSend} aria-label="메시지 전송">보내기</Button>
        </div>
      </section>
    </div>
  )
}
