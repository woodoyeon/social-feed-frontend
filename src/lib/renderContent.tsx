// src/lib/renderContent.tsx
import Link from 'next/link'
import React from 'react'

const ENTITY_RE =
  /(https?:\/\/[^\s<]+)|(^|[^\w])#([0-9A-Za-z가-힣_]+)|(^|[^\w])@([A-Za-z0-9_]{1,15})/g

export function renderContent(text: string = ''): React.ReactNode {
  const parts: React.ReactNode[] = []
  let i = 0
  let m: RegExpExecArray | null
  ENTITY_RE.lastIndex = 0

  while ((m = ENTITY_RE.exec(text))) {
    // URL
    if (m[1]) {
      const start = m.index
      if (i < start) parts.push(text.slice(i, start))
      const url = m[1]
      parts.push(
        <a
          key={`url:${start}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          {url}
        </a>
      )
      i = start + url.length
      continue
    }

    // #tag
    if (m[3]) {
      const pre = m[2] ?? ''
      const tag = m[3]
      const start = m.index + pre.length
      if (i < start) parts.push(text.slice(i, start))
      parts.push(
        <Link
          key={`tag:${start}`}
          href={`/search?q=${encodeURIComponent(tag)}`}  // ← %23 제거
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          #{tag}
        </Link>

      )
      i = start + ('#' + tag).length
      continue
    }

    // @mention
    if (m[5]) {
      const pre = m[4] ?? ''
      const user = m[5]
      const start = m.index + pre.length
      if (i < start) parts.push(text.slice(i, start))
      parts.push(
        <Link
          key={`men:${start}`}
          href={`/user/${encodeURIComponent(user)}`}
          className="text-green-600 dark:text-green-400 hover:underline font-semibold"
        >
          @{user}
        </Link>
      )
      i = start + ('@' + user).length
      continue
    }
  }

  if (i < text.length) parts.push(text.slice(i))

  return <>{parts}</>
}
