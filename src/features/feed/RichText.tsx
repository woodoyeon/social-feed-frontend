// src/features/feed/RichText.tsx
'use client'

import Link from 'next/link'
import { parseEntities } from '@/lib/parseEntities'

export default function RichText({ text = '' }: { text?: string }) {
  const tokens = parseEntities(text)
  return (
    <>
      {tokens.map((tk, i) => {
        if (tk.t === 'text') return <span key={i}>{tk.v}</span>
        if (tk.t === 'url')
          return (
            <a
              key={i}
              href={tk.v}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {tk.v}
            </a>
          )
        if (tk.t === 'tag')
          return (
            <Link
              key={i}
              href={`/search?q=%23${encodeURIComponent(tk.v)}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              #{tk.v}
            </Link>
          )
        if (tk.t === 'mention')
          return (
            <Link
              key={i}
              href={`/user/${encodeURIComponent(tk.v)}`}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              @{tk.v}
            </Link>
          )
        return null
      })}
    </>
  )
}
