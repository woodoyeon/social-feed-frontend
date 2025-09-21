// src/app/messages/page.tsx
import { Suspense } from 'react'
import Shell from '@/features/feed/Shell'
import Header from '@/features/feed/Header'
import MessagesClient from './MessagesClient'

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted">메시지를 불러오는 중…</div>}>
      <Shell>
        <div className="sticky top-0 z-10 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
          <Header />
        </div>
        <MessagesClient />
      </Shell>
    </Suspense>
  )
}
