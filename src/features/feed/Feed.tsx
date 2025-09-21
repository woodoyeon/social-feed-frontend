// src/features/feed/Feed.tsx
'use client'

import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteFeed } from './hooks/useInfiniteFeed'
import PostCard from './PostCard'
import { FeedSkeleton } from './Skeletons'
import { usePosts } from '@/store/usePosts'
import { LivePolling /*, MockSocket */ } from '@/lib/live'

type FeedProps = {
  mode?: 'all' | 'following'
  followings?: string[] // 팔로우한 계정 리스트
}

export default function Feed({ mode = 'all', followings = [] }: FeedProps) {
  const { items, loadMore, loading, hasMore, newCount } = useInfiniteFeed()
  const { ref, inView } = useInView()

  // ✅ 탭 모드에 따른 필터링 (null 가드 포함)
  const visibleItems = useMemo(() => {
    if (mode !== 'following') return items
    if (!followings.length) return []
    const set = new Set(followings)
    return items.filter(p => p?.author?.username && set.has(p.author.username))
  }, [items, mode, followings])

  // 가상화 세팅
  const rowVirtualizer = useWindowVirtualizer({
    count: visibleItems.length,
    estimateSize: () => 420,
    overscan: 8,
    getItemKey: (index) => visibleItems[index]?.id ?? index,
  })

  // 최초 로드
  useEffect(() => { loadMore() }, [loadMore])

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasMore && !loading) loadMore()
  }, [inView, hasMore, loading, loadMore])

  // 라이브 업데이트 (live → author.username === 'live'가 주기적으로 들어옴)
  useEffect(() => {
    const live = new LivePolling(5000)
    live.start()
    // const live = new MockSocket(); live.start(3000)
    return () => live.stop()
  }, [])

  return (
    <div className="relative" role="feed" aria-busy={loading} id="feed-root">
      {/* 새 글 도착 알림 */}
      {newCount > 0 && (
        <>
          <div aria-live="polite" className="sr-only">새 게시물 {newCount}개가 도착했습니다.</div>
          <button
            className="sticky top-2 z-10 mx-auto block px-3 py-1 text-sm rounded-full bg-[--color-accent] text-white shadow
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => usePosts.getState().flushLive()}
            aria-controls="feed-root"
            aria-label={`새 게시물 ${newCount}개 보기`}
          >
            새 게시물 {newCount}개 보기
          </button>
        </>
      )}

      {/* 게시물이 없을 때 */}
      {!loading && visibleItems.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          {mode === 'following'
            ? '팔로우한 계정의 새 게시물이 아직 없어요.'
            : '표시할 게시물이 없습니다.'}
        </div>
      )}

      {/* 가상 리스트 캔버스 */}
      <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((v) => {
          const post = visibleItems[v.index]
          if (!post) return null
          return (
            <div
              key={v.key}
              data-index={v.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 right-0 will-change-transform"
              style={{ transform: `translateY(${v.start}px)` }}
            >
              <PostCard post={post} />
            </div>
          )
        })}
      </div>

      {loading && <FeedSkeleton />}
      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  )
}
