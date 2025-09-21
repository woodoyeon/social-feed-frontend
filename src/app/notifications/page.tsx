// src/app/notifications/page.tsx
import { Suspense } from 'react'
import Shell from '@/features/feed/Shell'
import Header from '@/features/feed/Header'

type NotiItem = {
  id: number
  type: 'like' | 'repost' | 'mention' | 'bookmark'
  text: string
  link?: string
  createdAt: string
  read?: boolean
}

// 데모용 더미
const demo: NotiItem[] = [
  { id: 1, type: 'like', text: '누군가가 회원님의 게시글을 좋아합니다.', createdAt: new Date().toISOString() },
  { id: 2, type: 'mention', text: '@myusername 멘션이 도착했어요.', createdAt: new Date().toISOString() },
]

// 👇 실제 UI 로직은 이 안으로 이동
function NotificationsInner() {
  const list = demo

  return (
    <Shell>
      <div className="sticky top-0 z-10 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <Header />
        <div className="px-4 py-2 text-xl font-bold">Notifications</div>
      </div>

      <section aria-labelledby="noti-heading">
        <h1 id="noti-heading" className="sr-only">Notifications</h1>

        {list.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            아직 알림이 없어요.
            <div className="mt-2 text-sm">좋아요/멘션/리포스트가 오면 여기에서 확인할 수 있어요.</div>
          </div>
        ) : (
          <ul>
            {list.map(n => (
              <li key={n.id} className="px-4 py-3 border-b border-divider hover:bg-surface-2">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-muted mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  )
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted">알림 불러오는 중…</div>}>
      <NotificationsInner />
    </Suspense>
  )
}
