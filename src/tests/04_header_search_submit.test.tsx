// src/tests/04_header_search_submit.test.tsx
/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// ✅ next/navigation mock — useSearchParams를 "항상 같은 객체"로 고정
const push = jest.fn()

const searchParamsMock = {
  get: () => '',           // 초기 q 값 없음
  toString: () => '',
  entries: function* () {},
  keys: function* () {},
  values: function* () {},
  has: () => false,
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, prefetch: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => searchParamsMock,  // ← 동일 참조 보장!
}))

import Header from '@/features/feed/Header'

test('검색어 입력 후 submit하면 /search?q= 로 push 호출', async () => {
  const user = userEvent.setup()
  render(<Header />)

  const input = screen.getByLabelText('검색어 입력') as HTMLInputElement

  // 1) 실제 타이핑(비동기)으로 상태 업데이트
  await user.type(input, 'hello world')

  // (선택) 값이 반영됐는지 확인
  expect(input).toHaveValue('hello world')

  // 2) 폼 제출(상태 업데이트 타이밍을 act로 감싸 안정화)
  await act(async () => {
    const form = input.closest('form')!
    fireEvent.submit(form)
  })

  // 3) 라우터 push 호출 검증
  await waitFor(() => {
    expect(push).toHaveBeenCalledWith('/search?q=hello%20world')
  })
})
