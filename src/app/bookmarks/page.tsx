//src/app/bookmarks/page.tsx
'use client'

import { useMemo } from 'react'
import Shell from '@/features/feed/Shell'
import PostCard from '@/features/feed/PostCard'
import { usePosts } from '@/store/usePosts'

export default function BookmarksPage() {
  const { items, bookmarks } = usePosts()

  // 북마크된 게시물만 골라 최신순으로 정렬
  const bookmarkedPosts = useMemo(() => {
    const set = new Set(bookmarks)
    const list = items.filter(p => set.has(p.id))
    // createdAt 기준 내림차순 (숫자 id면 id 내림차순도 OK)
    return list.sort((a, b) => {
      const ta = +new Date(a.createdAt)
      const tb = +new Date(b.createdAt)
      return tb - ta
    })
  }, [items, bookmarks])

  return (
    <Shell>
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-slate-950/80">
        <div className="px-4 py-3 text-xl font-bold">Bookmarks</div>
      </div>

      {/* 콘텐츠 */}
      <section aria-labelledby="bookmarks-heading">
        <h1 id="bookmarks-heading" className="sr-only">Bookmarked posts</h1>

        {/* 비어있을 때 안내 */}
        {bookmarkedPosts.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            아직 북마크한 게시물이 없어요.
            <div className="mt-2 text-sm">
              타임라인에서 <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">북마크</span> 아이콘을 눌러 저장해 보세요.
            </div>
          </div>
        ) : (
          <div role="feed" aria-busy="false">
            {bookmarkedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </Shell>
  )
}
