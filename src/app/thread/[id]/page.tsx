// src/app/thread/[id]/page.tsx
'use client'
import { useParams } from 'next/navigation'
import Shell from '@/features/feed/Shell'
import Header from '@/features/feed/Header'
import ThreadView from '@/features/feed/ThreadView'

export default function ThreadPage() {
  const params = useParams() as { id?: string }
  const id = Number(params?.id || 0)

  return (
    <Shell>
      <Header />
      <ThreadView postId={id} />
    </Shell>
  )
}
