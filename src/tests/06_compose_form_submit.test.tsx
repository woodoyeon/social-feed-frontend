// src/tests/06_compose_form_submit.test.tsx
/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

const addMock = jest.fn()
const prependMock = jest.fn()

jest.mock('@/store/usePosts', () => ({
  usePosts: (selector?: any) => {
    const state = {
      add: addMock,
      prepend: prependMock,
      items: [],
      loadMore: jest.fn(),
    }
    return selector ? selector(state) : state
  },
}))

import ComposeForm from '@/features/feed/ComposeForm'

beforeEach(() => {
  addMock.mockReset()
  prependMock.mockReset()
})

test('내용 입력 후 제출하면 prepend가 호출된다', () => {
  render(<ComposeForm variant="inline" />)

  const textarea = screen.getByPlaceholderText(/happening\?/i) as HTMLTextAreaElement
  fireEvent.change(textarea, { target: { value: '테스트 글' } })
  fireEvent.submit(textarea.closest('form')!)

  expect(prependMock).toHaveBeenCalled()
  expect(prependMock.mock.calls[0][0]).toEqual(
    expect.objectContaining({ content: '테스트 글' })
  )
})

test('빈 입력은 호출되지 않는다', () => {
  render(<ComposeForm variant="inline" />)

  const textarea = screen.getByPlaceholderText(/happening\?/i)
  fireEvent.change(textarea, { target: { value: '' } })
  fireEvent.submit(textarea.closest('form')!)

  expect(prependMock).not.toHaveBeenCalled()
  expect(addMock).not.toHaveBeenCalled()
})
