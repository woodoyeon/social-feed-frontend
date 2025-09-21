// src/features/feed/RightRail.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

import {
  Search as SearchIcon,
  Heart,
  Repeat2,
  AtSign,
  Hash,
  Users,
  BarChart3,
} from 'lucide-react'

import { usePosts } from '@/store/usePosts'

type Trend = { key: string; label: string; count: number }
const HASHTAG_RE = /(^|\s)#([0-9A-Za-z가-힣_]+)/g

export default function RightRail() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const items = usePosts((s) => s.items)

  // 🔍 검색 (300ms 디바운스)
  useEffect(() => {
    const id = setTimeout(() => {
      if (!q.trim()) return
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }, 300)
    return () => clearTimeout(id)
  }, [q, router])

  const fmt = (n: number) =>
    new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(n)

  const { stats, topAuthors, topHashtags } = useMemo(() => {
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    let totalLikes = 0,
      totalRts = 0,
      last24 = 0

    const authorLikes = new Map<
      string,
      { name: string; username: string; likes: number }
    >()
    const tagCount = new Map<string, number>()

    for (const p of items) {
      const ts = +new Date(p.createdAt)
      if (Number.isFinite(ts) && ts >= dayAgo) last24++
      totalLikes += p.likes ?? 0
      totalRts += p.retweets ?? 0

      // 해시태그 집계
      if (typeof p.content === 'string') {
        const seen = new Set<string>()
        HASHTAG_RE.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = HASHTAG_RE.exec(p.content))) {
          const tag = m[2]
          if (seen.has(tag)) continue
          seen.add(tag)
          tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
        }
      }

      // 작성자 좋아요 합산
      const key = p.author?.username ?? 'unknown'
      if (!authorLikes.has(key))
        authorLikes.set(key, {
          name: p.author?.name ?? key,
          username: key,
          likes: 0,
        })
      authorLikes.get(key)!.likes += p.likes ?? 0
    }

    const topAuthors = Array.from(authorLikes.values())
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 20)

    const topHashtags: Trend[] = Array.from(tagCount, ([k, v]) => ({
      key: k,
      label: `#${k}`,
      count: v,
    }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30)

    return {
      stats: { loaded: items.length, last24, totalLikes, totalRts },
      topAuthors,
      topHashtags,
    }
  }, [items])

  return (
    <aside className="flex flex-col gap-4 py-4 pr-1 max-h-[calc(100dvh-16px)]">
      {/* 🔍 검색 */}
      <div className="px-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            placeholder="검색어, #해시태그"
            aria-label="검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 rounded-full bg-surface-2 border border-divider pl-10 focus-visible:ring-2 focus-visible:ring-[--color-ring] placeholder:text-muted"
          />
        </div>
      </div>

      {/* 📊 오늘의 요약 */}
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <BarChart3 className="h-5 w-5 text-blue-500" /> 오늘의 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted">최근 24시간</div>
            <div className="text-2xl font-semibold tabular-nums">
              {fmt(stats.last24)}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted">총 ♡ / ↻</div>
            <div className="text-xl font-semibold tabular-nums">
              {fmt(stats.totalLikes)} / {fmt(stats.totalRts)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 실시간 해시태그 */}
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Hash className="h-5 w-5 text-purple-500" /> 실시간 해시태그
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topHashtags.length === 0 ? (
            <p className="text-sm text-muted">표시할 해시태그가 없어요.</p>
          ) : (
            <ScrollArea className="h-72">
              <ul className="space-y-1">
                {topHashtags.map((t) => (
                  <li key={t.key}>
                    <Link
                      href={`/search?q=%23${encodeURIComponent(t.key)}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-surface-2"
                    >
                      <span className="font-medium text-blue-500">
                        {t.label}
                      </span>
                      <Badge variant="secondary">{t.count} posts</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* 👥 인기 작성자 */}
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Users className="h-5 w-5 text-emerald-500" /> 인기 작성자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <ul className="space-y-1">
              {topAuthors.map((a) => (
                <li key={a.username}>
                  <Link
                    href={`/user/${encodeURIComponent(a.username)}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-surface-2"
                  >
                    <span className="truncate">
                      <span className="font-semibold">{a.name}</span>{' '}
                      <span className="text-emerald-600">@{a.username}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Heart className="h-3 w-3 text-rose-500" />
                      {fmt(a.likes)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  )
}
