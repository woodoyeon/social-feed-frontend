/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

// jsdom은 scrollTo 없음 → 스텁
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), configurable: true })

// IntersectionObserver 훅 모킹: 항상 not inView
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}))

// ✅ PostCard 자체를 매우 단순한 목으로 대체 (복잡한 내부 훅 의존성 제거)
jest.mock('@/features/feed/PostCard', () => ({
  __esModule: true,
  default: (props: any) => <div>{props.post.content}</div>,
}))

// usePosts 모킹 (selector 패턴 대응)
const loadMore = jest.fn()
jest.mock('@/store/usePosts', () => ({
  usePosts: (selector?: any) => {
    const state = {
      items: [
        {
          id: 1,
          content: '첫 번째 글',
          author: { name: 'A', username: 'a', profileImage: '' },
          createdAt: Date.now(),
          isLiked: false,
          isRetweeted: false,
          comments: 0,
          likes: 0,
          retweets: 0,
        },
        {
          id: 2,
          content: '두 번째 글',
          author: { name: 'B', username: 'b', profileImage: '' },
          createdAt: Date.now(),
          isLiked: false,
          isRetweeted: false,
          comments: 0,
          likes: 0,
          retweets: 0,
        },
      ],
      hasMore: false,
      loading: false,
      loadMore,
    }
    return selector ? selector(state) : state
  },
}))

import Feed from '@/features/feed/Feed'

beforeEach(() => {
  loadMore.mockReset()
})

test('피드에 글 목록이 보인다', () => {
  render(<Feed />)
  expect(screen.getByText('첫 번째 글')).toBeInTheDocument()
  expect(screen.getByText('두 번째 글')).toBeInTheDocument()
})

test('마운트 시 loadMore가 호출된다', () => {
  render(<Feed />)
  expect(loadMore).toHaveBeenCalled()
})
