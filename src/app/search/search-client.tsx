// src/app/search/search-client.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { usePosts } from '@/store/usePosts'
import PostCard from '@/features/feed/PostCard'
import Header from '@/features/feed/Header'

export default function SearchClient() {
  const q = (useSearchParams().get('q') ?? '').toLowerCase()
  const items = usePosts(s => s.items)

  const filtered = useMemo(
    () => (!q ? items : items.filter(p => p.content.toLowerCase().includes(q))),
    [q, items]
  )

  return (
    <>
      <Header />
      <div aria-live="polite">
        {filtered.map(p => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  )
}
