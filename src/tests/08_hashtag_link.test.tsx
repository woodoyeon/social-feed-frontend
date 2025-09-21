//src/tests/08_hashtag_link.test.tsx
import { highlight } from '@/lib/parse'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

test('해시태그 링크 href', () => {
  render(<div dangerouslySetInnerHTML={{ __html: highlight('hello #tag') }} />)
  const a = screen.getByText('#tag') as HTMLAnchorElement
  expect(a.getAttribute('href')).toBe('/search?q=tag')
})
