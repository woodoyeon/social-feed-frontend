// src/app/search/page.tsx
import Shell from '@/features/feed/Shell'
import { Suspense } from 'react'
import SearchClient from './search-client'

export default function SearchPage() {
  return (
    <Shell>
      <Suspense fallback={<div className="p-4">검색 로딩…</div>}>
        <SearchClient />
      </Suspense>
    </Shell>
  )
}
