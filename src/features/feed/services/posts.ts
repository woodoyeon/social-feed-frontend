// src/features/feed/services/posts.ts
import mock from '@/lib/mock/posts.json'
import type { Post } from '../model/post'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// 가이드의 mockPosts 이름과 느낌을 맞추고 싶다면 이렇게 별칭을 둡니다.
const mockPosts = mock as Post[]

// 개발단계용: mock 소진 시에도 이어서 생성하는 헬퍼
function makeFakePosts(count: number, startSeed = 0): Post[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const id = now + startSeed + i
    return {
      id,
      author: {
        name: 'DevUser',
        username: 'dev_user',
        profileImage: `https://picsum.photos/40/40?random=${id % 1000}`,
      },
      content: `Generated post #${id} — keep scrolling 🚀`,
      images:
        Math.random() < 0.18
          ? [`https://picsum.photos/600/350?random=${id % 1000}`]
          : [],
      // startSeed 반영해서 페이지 커져도 시간 순서 유지
      createdAt: new Date(now - (startSeed + i) * 1000 * 45).toISOString(),
      likes: Math.floor(Math.random() * 200),
      retweets: Math.floor(Math.random() * 80),
      comments: Math.floor(Math.random() * 50),
      isLiked: false,
      isRetweeted: false,
    }
  })
}

/**
 * 무한 스크롤 개발 편의용 fetch:
 * - mock 내 범위는 slice
 * - mock을 초과하면 makeFakePosts로 이어서 채움 (실전 테스트에 유리)
 *
 * 가이드를 100% 따르려면 기본 인자도 page=1, limit=10, delay=1000ms 로 둡니다.
 */
export async function fetchPosts(page = 1, limit = 10): Promise<Post[]> {
  await delay(1000)

  const start = (page - 1) * limit
  const end = start + limit

  if (start < mockPosts.length) {
    const slice = mockPosts.slice(start, Math.min(end, mockPosts.length))
    if (end <= mockPosts.length) return slice
    // mock 남은 부분 + 생성분 결합
    const need = end - mockPosts.length
    return [...slice, ...makeFakePosts(need, end)]
  }

  // 전부 mock 초과: 생성 데이터만
  return makeFakePosts(limit, start)
}

/**
 * 좋아요/리트윗: 300ms 지연 후 성공만 반환
 * (상태 변화는 클라이언트에서 낙관적 업데이트로 처리)
 */
export async function toggleLike(id: number) {
  await delay(300)
  return { success: true } as const
}

export async function toggleRetweet(id: number) {
  await delay(300)
  return { success: true } as const
}
