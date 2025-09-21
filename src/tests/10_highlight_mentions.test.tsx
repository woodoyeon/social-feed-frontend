// src/tests/10_highlight_mentions.test.tsx
import { highlight } from '@/lib/parse'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

test('멘션은 /user/username 링크로 변환된다', () => {
  render(<div dangerouslySetInnerHTML={{ __html: highlight('hi @john') }} />)
  const a = screen.getByText('@john') as HTMLAnchorElement
  expect(a.getAttribute('href')).toBe('/user/john')
})
