// src/store/usePosts.ts
'use client'

import { create } from 'zustand'
import { fetchPosts, toggleLike, toggleRetweet } from '@/features/feed/services/posts'
import type { Post } from '@/features/feed/model/post'
import { saveCache, loadCache } from '@/utils/cache'
import { toastBus } from '@/components/ui/use-toast'
import { useNotifications, type NotiType } from '@/store/useNotifications'

type ThreadState = {
  root?: Post
  replies: Post[]          // 평평한 배열 (parentId로 계층 구분)
  loading: boolean
  hasMore: boolean
  page: number
  _lastLoadAt?: number     // 무한 호출 방지용 타임스탬프
}

type State = {
  followings: string[]
  items: Post[]
  liveBuffer: Post[]
  newCount: number
  page: number
  hasMore: boolean
  loading: boolean
  bookmarks: number[]
  isOffline: boolean
  loadMore: () => Promise<void>
  prepend: (p: Post, markNew?: boolean) => void
  like: (id: number) => Promise<void>
  retweet: (id: number) => Promise<void>
  repost: (origId: number) => void
  quote: (origId: number, text: string, images?: string[]) => void
  toggleBookmark: (id: number) => void
  reset: () => void
  pushLive: (p: Post) => void
  flushLive: () => void
  clearNew: () => void
  setOffline: (v: boolean) => void

  threads: Record<number, ThreadState>
  fetchThread: (rootId: number) => Promise<void>
  loadMoreReplies: (rootId: number) => Promise<void>
  reply: (rootId: number, text: string, parentId?: number) => void
}

const CACHE_KEY = 'feed_cache_v2'
const BK_KEY = 'bookmarks_v1'
const LS_LIKES = 'likes_v1'
const LS_RTS = 'retweets_v1'
const MY_USERNAME = 'myusername' // TODO: 실제 로그인 유저로 교체

function pushNoti(type: NotiType, text: string, link?: string) {
  useNotifications.getState().push({
    id: Date.now() + Math.random(),
    type, text, link,
    createdAt: new Date().toISOString(),
    read: false
  })
}

function loadSet(key: string): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set<number>(JSON.parse(localStorage.getItem(key) || '[]'))
  } catch {
    return new Set()
  }
}
function saveSet(key: string, s: Set<number>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(Array.from(s)))
  }
}

const PAGE_SIZE = 20
const MAX_ITEMS = 1000

/** id 기준 de-dup */
function dedupPosts(arr: Post[]) {
  const seen = new Set<number>()
  return arr.filter((x) => {
    if (seen.has(x.id)) return false
    seen.add(x.id)
    return true
  })
}

export const usePosts = create<State>((set, get) => {
  const likedSet = loadSet(LS_LIKES)
  const rtSet = loadSet(LS_RTS)

  return {
    // 데모 기본 팔로잉
    followings:
      typeof window === 'undefined'
        ? ['live']
        : (() => {
            try { return ['live'] } catch { return ['live'] }
          })(),

    items: [],
    liveBuffer: [],
    newCount: 0,
    page: 1,
    hasMore: true,
    loading: false,
    isOffline: false,

    threads: {},

    bookmarks:
      typeof window === 'undefined'
        ? []
        : (() => {
            try { return JSON.parse(localStorage.getItem(BK_KEY) || '[]') }
            catch { return [] }
          })(),

    /** 피드 무한 로드 */
    async loadMore() {
      const { page, items, loading, hasMore } = get()
      if (loading || !hasMore) return
      set({ loading: true })
      try {
        const batch = await fetchPosts(page, PAGE_SIZE)
        const hydrated = batch.map(p => ({
          ...p,
          isLiked: likedSet.has(p.id) || p.isLiked,
          isRetweeted: rtSet.has(p.id) || p.isRetweeted,
        }))
        const merged = [...items, ...hydrated]
        const trimmed = merged.length > MAX_ITEMS ? merged.slice(0, MAX_ITEMS) : merged
        const nextHasMore = batch.length === PAGE_SIZE
        set({ items: trimmed, page: page + 1, hasMore: nextHasMore, loading: false })
        saveCache(CACHE_KEY, { items: trimmed, page: page + 1 })
      } catch {
        const cached = loadCache<{ items: Post[]; page: number }>(CACHE_KEY)
        if (cached) {
          set({ items: cached.items, page: cached.page, loading: false, hasMore: true })
        } else {
          set({ loading: false })
        }
      }
    },

    prepend(p, markNew = false) {
      set(s => {
        const merged = [p, ...s.items]
        const trimmed = merged.length > MAX_ITEMS ? merged.slice(0, MAX_ITEMS) : merged
        return { items: trimmed, newCount: markNew ? s.newCount + 1 : s.newCount }
      })
      if (typeof p.content === 'string' &&
          p.content.toLowerCase().includes('@' + MY_USERNAME.toLowerCase())) {
        pushNoti('mention', `${p.author?.name ?? '누군가'}님이 회원님을 멘션했습니다.`, `/`)
      }
    },

    /** 좋아요 */
    async like(id) {
      const wasLiked = likedSet.has(id)
      set(s => ({
        items: s.items.map(p =>
          p.id === id
            ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        ),
      }))

      if (wasLiked) {
        likedSet.delete(id)
        toastBus.show({ title: '좋아요 취소 💔', description: '해당 게시물의 좋아요를 취소했습니다.' })
      } else {
        likedSet.add(id)
        toastBus.show({ title: '좋아요 ❤️', description: '계속 힘내세요! 좋아요를 누른 게시물이 많을수록 타임라인이 더 좋아집니다.' })
      }
      saveSet(LS_LIKES, likedSet)

      const target = get().items.find(p => p.id === id)
      if (target?.author?.username === MY_USERNAME && !wasLiked) {
        pushNoti('like', `누군가가 회원님의 게시글을 좋아합니다.`, `/`)
      }

      const res = await toggleLike(id)
      if (!res.success) {
        set(s => ({
          items: s.items.map(p =>
            p.id === id
              ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
              : p
          ),
        }))
      }
    },

    /** 리트윗(토글) */
    async retweet(id) {
      const wasRt = rtSet.has(id)
      set(s => ({
        items: s.items.map(p =>
          p.id === id
            ? { ...p, isRetweeted: !p.isRetweeted, retweets: p.isRetweeted ? p.retweets - 1 : p.retweets + 1 }
            : p
        ),
      }))

      wasRt ? rtSet.delete(id) : rtSet.add(id)
      saveSet(LS_RTS, rtSet)

      const target = get().items.find(p => p.id === id)
      if (target?.author?.username === MY_USERNAME && !wasRt) {
        pushNoti('repost', `누군가가 회원님의 게시글을 공유했습니다.`, `/`)
      }

      const res = await toggleRetweet(id)
      if (!res.success) {
        set(s => ({
          items: s.items.map(p =>
            p.id === id
              ? { ...p, isRetweeted: !p.isRetweeted, retweets: p.isRetweeted ? p.retweets - 1 : p.retweets + 1 }
              : p
          ),
        }))
      }
    },

    /** 재게시 카드 만들기 (내 타임라인에 복제) */
    repost(origId) {
      const { items, prepend } = get()
      const original = items.find(p => p.id === origId)
      if (!original) return
      const updatedRetweets = (original.retweets ?? 0) + 1
      set(s => ({
        items: s.items.map(p =>
          p.id === origId ? { ...p, retweets: updatedRetweets, isRetweeted: true } : p
        ),
      }))
      if (original?.author?.username === MY_USERNAME) {
        pushNoti('repost', `누군가가 회원님의 게시글을 공유했습니다.`, `/`)
      }

      const now = new Date().toISOString()
      const card: Post = {
        id: Date.now(),
        type: 'repost' as const,
        repostedBy: { name: '내 이름', username: 'myusername', profileImage: 'https://picsum.photos/40/40?random=99' },
        original,
        author: original.author,
        content: original.content,
        images: original.images ?? [],
        createdAt: now,
        likes: 0,
        retweets: updatedRetweets,
        comments: original.comments,
        isLiked: false,
        isRetweeted: true,
      } as any
      prepend(card)
    },

    /** 인용 트윗 */
    quote(origId, text, images = []) {
      const { items, prepend } = get()
      const original = items.find(p => p.id === origId)
      if (!original) return
      const now = new Date().toISOString()
      const card: Post = {
        id: Date.now(),
        type: 'quote' as const,
        quotedId: origId,
        quoted: original,
        author: { name: '내 이름', username: 'myusername', profileImage: 'https://picsum.photos/40/40?random=99' },
        content: text,
        images,
        createdAt: now,
        likes: 0,
        retweets: 0,
        comments: 0,
        isLiked: false,
        isRetweeted: false,
      } as any
      prepend(card)
    },

    toggleBookmark(id) {
      const wasBookmarked = get().bookmarks.includes(id)
      const cur = new Set(get().bookmarks)
      wasBookmarked ? cur.delete(id) : cur.add(id)
      const arr = Array.from(cur)
      if (typeof window !== 'undefined') {
        localStorage.setItem(BK_KEY, JSON.stringify(arr))
      }
      set({ bookmarks: arr })

      const post = get().items.find(p => p.id === id)
      if (post?.author?.username === MY_USERNAME && !wasBookmarked) {
        pushNoti('bookmark', `누군가가 회원님의 게시글을 북마크했습니다.`, `/`)
      }
    },

    reset() {
      set({ items: [], liveBuffer: [], newCount: 0, page: 1, hasMore: true })
      saveCache(CACHE_KEY, { items: [], page: 1 })
    },

    // 실시간 버퍼
    pushLive(p) {
      const { items, liveBuffer } = get()
      const duplicated =
        items.some(i => i.id === p.id) || liveBuffer.some(i => i.id === p.id)
      if (duplicated) return
      const next = [p, ...liveBuffer].slice(0, 100)
      set({ liveBuffer: next, newCount: next.length })

      if (typeof p.content === 'string' &&
          p.content.toLowerCase().includes('@' + MY_USERNAME.toLowerCase())) {
        pushNoti('mention', `${p.author?.name ?? '누군가'}님이 회원님을 멘션했습니다.`, `/`)
      }
    },

    flushLive() {
      const { items, liveBuffer } = get()
      if (liveBuffer.length === 0) return
      set({ items: [...liveBuffer, ...items], liveBuffer: [], newCount: 0 })
    },

    clearNew() { get().flushLive() },

    setOffline(v) {
      set({ isOffline: v })
      if (v) {
        toastBus.show({ title: '⚠️ 오프라인 모드', description: '네트워크가 끊겼습니다. 캐시된 게시물을 표시합니다.' })
      } else {
        toastBus.show({ title: '✅ 온라인 복구', description: '네트워크 연결이 다시 정상화되었습니다.' })
      }
    },

    /** 스레드 초기 로드 (루트 단건 먼저 보장) */
    async fetchThread(rootId) {
      const { threads, items } = get()
      if (threads[rootId]?.root && threads[rootId].replies.length) return

      // 1) 피드에 있으면 사용
      let root = items.find(p => p.id === rootId)

      // 2) 없으면 서버(모킹)에서 단건 조회
      if (!root) {
        try { root = await mockFetchPost(rootId) } catch {}
      }

      // 3) 그래도 없으면 안전 더미
      if (!root) {
        root = {
          id: rootId,
          author: { name: '알 수 없음', username: 'unknown', profileImage: 'https://picsum.photos/40/40?random=1' } as any,
          content: `게시물 #${rootId}`,
          images: [],
          createdAt: new Date(Date.now() - 3600_000).toISOString(),
          likes: 0, retweets: 0, comments: 0,
          isLiked: false, isRetweeted: false,
        } as Post
      }

      set({
        threads: {
          ...threads,
          [rootId]: { root, replies: [], loading: true, hasMore: true, page: 1, _lastLoadAt: 0 }
        }
      })

      const batch = await mockFetchReplies(rootId, 1, PAGE_SIZE)
      set(s => ({
        threads: {
          ...s.threads,
          [rootId]: {
            ...s.threads[rootId],
            replies: batch,
            loading: false,
            hasMore: batch.length === PAGE_SIZE,
            page: 1,
            _lastLoadAt: Date.now()
          }
        }
      }))
    },

    /** 스레드 더 불러오기 (디바운스 + 상한) */
    async loadMoreReplies(rootId) {
      const s = get()
      const t = s.threads[rootId]
      if (!t || t.loading || !t.hasMore) return

      // 디바운스 500ms
      const now = Date.now()
      if (t._lastLoadAt && now - t._lastLoadAt < 500) return

      set({
        threads: {
          ...s.threads,
          [rootId]: { ...t, loading: true }
        }
      })

      const nextPage = t.page + 1
      const pageSize = PAGE_SIZE
      const MAX_PAGES = 20
      const batch = await mockFetchReplies(rootId, nextPage, pageSize)

      set(cur => {
        const curT = cur.threads[rootId]
        const dedup = dedupPosts([...curT.replies, ...batch])
        return {
          threads: {
            ...cur.threads,
            [rootId]: {
              ...curT,
              replies: dedup,
              loading: false,
              hasMore: batch.length === pageSize && nextPage < MAX_PAGES,
              page: nextPage,
              _lastLoadAt: now
            }
          }
        }
      })
    },

    /** 답글/대댓글 작성 */
    reply(rootId, text, parentId) {
      const me = { name: '내 이름', username: 'myusername', profileImage: 'https://picsum.photos/40/40?random=99' }
      const uniqueId = Date.now() + Math.floor(Math.random() * 1000)

      const pid = parentId ?? rootId
      const newPost: Post = {
        id: uniqueId,
        author: me as any,
        content: text,
        images: [],
        createdAt: new Date().toISOString(),
        likes: 0, retweets: 0, comments: 0,
        isLiked: false, isRetweeted: false,
        parentId: pid,                 // ⭐ 대댓글 가능 (부모가 댓글 id)
      }

      set(s => {
        const t = s.threads[rootId]
        if (!t) {
          return {
            ...s,
            threads: {
              ...s.threads,
              [rootId]: {
                root: s.items.find(p => p.id === rootId),
                replies: [newPost],
                loading: false,
                hasMore: true,
                page: 1,
                _lastLoadAt: 0
              }
            }
          }
        }
        const prev = Array.isArray(t.replies) ? t.replies : []
        const dedup = dedupPosts([newPost, ...prev])

        return {
          ...s,
          items: s.items.map(p => p.id === rootId ? { ...p, comments: (p.comments ?? 0) + 1 } : p),
          threads: {
            ...s.threads,
            [rootId]: {
              ...t,
              replies: dedup,
              root: t.root ? { ...t.root, comments: (t.root.comments ?? 0) + 1 } : t.root
            }
          }
        }
      })
    },
  }
})

/** ---- 모킹 API들 (실서비스에선 실제 API로 대체) ---- */

/** 스레드용 답글 데이터: 총량 제한(TOTAL) + 자기 자신 부모 금지 */
async function mockFetchReplies(rootId: number, page: number, pageSize: number): Promise<Post[]> {
  await new Promise(r => setTimeout(r, 200))

  const TOTAL = 83
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, TOTAL)
  if (start >= TOTAL) return []

  const base = rootId * 100000
  const prevIds = Array.from({ length: Math.max(0, start) }, (_, j) => base + j + 1)

  return Array.from({ length: end - start }).map((_, i) => {
    const id = base + start + i + 1
    // 25% 확률로 기존 댓글에 대댓글로 붙이기
    const shouldNest = Math.random() < 0.25 && prevIds.length > 0
    let parentId = rootId
    if (shouldNest) {
      parentId = prevIds[Math.floor(Math.random() * prevIds.length)]
      if (parentId === id) parentId = rootId
    }

    return {
      id,
      author: {
        name: `User${(id % 50) + 1}`,
        username: `u${(id % 50) + 1}`,
        profileImage: `https://picsum.photos/40/40?random=${id % 100}`
      } as any,
      content: `@root${rootId} 에 대한 ${parentId === rootId ? '답글' : `대댓글(→ ${parentId})`} #${start + i + 1}`,
      images: Math.random() < 0.12 ? [`https://picsum.photos/seed/${id}/800/450`] : [],
      createdAt: new Date(Date.now() - (start + i) * 60000).toISOString(),
      likes: Math.floor(Math.random() * 20),
      retweets: Math.floor(Math.random() * 5),
      comments: 0,
      isLiked: false,
      isRetweeted: false,
      parentId,
    } as Post
  })
}

/** 루트 게시물 단건 조회(데모) – 스레드 헤더에 Root 더미가 보이지 않게 */
async function mockFetchPost(id: number): Promise<Post> {
  await new Promise(r => setTimeout(r, 120))
  return {
    id,
    author: { name: '내 이름', username: 'myusername', profileImage: 'https://picsum.photos/40/40?random=99' } as any,
    content: `내 게시물 #${id}`,
    images: [],
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    likes: 2, retweets: 0, comments: 0,
    isLiked: false, isRetweeted: false,
  } as Post
}
