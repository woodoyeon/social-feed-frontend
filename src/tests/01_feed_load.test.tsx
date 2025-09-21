/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// ✅ Next.js 라우터 훅 모킹 (Jest 환경에서 필요)
jest.mock('next/navigation', () => ({
  // 라우터: push 등을 쓰는 경우 대비
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  // 검색 파라미터: Header에서 get('q') 호출
  useSearchParams: () => ({
    get: () => '',          // 기본값: 없음
    toString: () => '',
    // 아래 메서드들까지 구현해두면 예외 없이 안전합니다
    entries: function* () {},
    keys: function* () {},
    values: function* () {},
    has: () => false,
  }),
}))

import Header from '@/features/feed/Header'

test('피드 헤더 렌더', () => {
  render(<Header />)
  expect(screen.getByText('Feed')).toBeInTheDocument()
})
