//05_header_online_status.test.tsx
import '@testing-library/jest-dom'
import { render, screen, act, waitFor } from '@testing-library/react'
import React from 'react'

// next/navigation mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => ({
    get: () => '', toString: () => '',
    entries: function* () {}, keys: function* () {}, values: function* () {}, has: () => false,
  }),
}))

// navigator.onLine 제어
function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true })
}

import Header from '@/features/feed/Header'

test('online/offline 상태 표시 변경', async () => {
  setOnline(true)
  render(<Header />)

  // 초기 상태: 온라인
  expect(screen.getByText('온라인')).toBeInTheDocument()

  // ✅ 상태 업데이트를 act로 감싸고, DOM 반영을 waitFor로 확인
  setOnline(false)
  await act(async () => {
    window.dispatchEvent(new Event('offline'))
  })
  await waitFor(() => {
    expect(screen.getByText('오프라인')).toBeInTheDocument()
  })

  setOnline(true)
  await act(async () => {
    window.dispatchEvent(new Event('online'))
  })
  await waitFor(() => {
    expect(screen.getByText('온라인')).toBeInTheDocument()
  })
})
