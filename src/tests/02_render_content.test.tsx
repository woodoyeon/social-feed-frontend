// src/tests/02_render_content.test.tsx

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { renderContent } from '@/lib/renderContent'

function Render({ text }: { text: string }) {
  return <p>{renderContent(text)}</p>
}

test('URL은 외부 링크로 렌더', () => {
  render(<Render text="check https://example.com now" />)
  const a = screen.getByText('https://example.com') as HTMLAnchorElement
  expect(a).toBeInTheDocument()
  expect(a).toHaveAttribute('href', 'https://example.com')
  expect(a).toHaveAttribute('target', '_blank')
})

test('#해시태그는 /search?q= 로 링크', () => {
  render(<Render text="hello #tag" />)
  const a = screen.getByText('#tag') as HTMLAnchorElement
  expect(a).toHaveAttribute('href', '/search?q=tag')
})

test('@멘션은 /user/ 로 링크', () => {
  render(<Render text="hi @user_1" />)
  const a = screen.getByText('@user_1') as HTMLAnchorElement
  expect(a).toHaveAttribute('href', '/user/user_1')
})
