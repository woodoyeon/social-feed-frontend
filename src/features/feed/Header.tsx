// src/features/feed/Header.tsx
'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import { Input } from '@/components/ui/input'

export default function Header(){
  const router = useRouter()
  const params = useSearchParams()

  const [q, setQ] = useState('')

  // ✅ 주소창의 ?q= 값을 입력창과 동기화 (검색 페이지로 진입/이동 시 자동 반영)
  useEffect(() => {
    const qp = params.get('q') ?? ''
    setQ(qp)
  }, [params])

  function onSubmit(e:React.FormEvent){
    e.preventDefault()
    router.push('/search?q=' + encodeURIComponent(q.trim()))
  }

  const [online, setOnline] = useState(true)
  useEffect(()=>{
    const sync = ()=> setOnline(navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return ()=>{
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  },[])

  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-slate-950/70 backdrop-blur border-b">
      <div className="max-w-2xl mx-auto flex items-center gap-3 p-3">
        <Link href="/" className="font-bold text-lg" aria-label="홈으로 이동">Feed</Link>

        {/* 검색 */}
        <form onSubmit={onSubmit} className="flex-1" role="search" aria-label="게시물 검색">
          <Input
            aria-label="검색어 입력"
            name="q"              // (백업) GET 전송 대비
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="검색 또는 #해시태그 / @username"
          />
        </form>

        <Link href="/compose" className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm" aria-label="게시물 작성 페이지로 이동">작성</Link>
        <ThemeToggle />
        <span className={"text-xs px-2 py-1 rounded border " + (online? "bg-green-50 dark:bg-green-900/30":"bg-amber-50 dark:bg-amber-900/30")} aria-live="polite">
          {online? "온라인" : "오프라인"}
        </span>
      </div>
    </header>
  )
}
