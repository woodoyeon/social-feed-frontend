//src/features/feed/hooks/useInfiniteFeed.ts
import { useEffect } from 'react'
import { usePosts } from '@/store/usePosts'

export function useInfiniteFeed() {
  const { items, loadMore, loading, hasMore, prepend, newCount, clearNew } = usePosts()

  // 라이브 새 글 시뮬: 비가시 상태에선 일시정지하여 낭비 방지
  useEffect(() => {
    let id: any

    const tick = () => {
      const now = new Date().toISOString()
      prepend(
        {
          id: Date.now(),
          author: { name: 'Live', username: 'live', profileImage: 'https://picsum.photos/40/40?random=10' },
          content: '실시간 새 글이 도착했습니다! #live @live #' + Math.floor(Math.random() * 100),
          images: [],
          createdAt: now,
          likes: 0,
          retweets: 0,
          comments: 0,
          isLiked: false,
          isRetweeted: false
        } as any,
        true
      )
    }

    const start = () => {
      if (id) clearInterval(id)
      id = setInterval(tick, 12000)
    }
    const stop = () => id && clearInterval(id)

    start()

    const onVis = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [prepend])

  return { items, loadMore, loading, hasMore, newCount, clearNew }
}
