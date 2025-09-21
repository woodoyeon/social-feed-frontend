// src/tests/03_highlight_more_cases.test.tsx
/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { highlight } from '@/lib/parse'

function MountHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

test('XSS 방지: 태그는 escape 된다', () => {
  const html = highlight('<script>alert(1)</script>')
  render(<MountHTML html={html} />)
  expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument()
})

test('URL → 외부 링크', () => {
  const html = highlight('go https://example.com')
  render(<MountHTML html={html} />)
  const a = screen.getByText('https://example.com') as HTMLAnchorElement
  expect(a).toHaveAttribute('href', 'https://example.com')
  expect(a).toHaveAttribute('target', '_blank')
})

test('#해시태그 → /search?q=tag', () => {
  const html = highlight('hello #태그')
  render(<MountHTML html={html} />)
  const a = screen.getByText('#태그') as HTMLAnchorElement
  // encodeURIComponent('태그') === %ED%83%9C%EA%B7%B8
  expect(a).toHaveAttribute('href', '/search?q=%ED%83%9C%EA%B7%B8')
})

test('@멘션 → /user/name', () => {
  const html = highlight('ping @john_doe')
  render(<MountHTML html={html} />)
  const a = screen.getByText('@john_doe') as HTMLAnchorElement
  expect(a).toHaveAttribute('href', '/user/john_doe')
})
