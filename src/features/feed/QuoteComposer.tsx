// src/features/feed/QuoteComposer.tsx
'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePosts } from '@/store/usePosts'
import type { Post } from './model/post'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  origId: number | null
  // 원글(옵션): 이미 Post 객체가 있다면 전달하면 탐색 생략
  original?: Post
}

export default function QuoteComposer({ open, onOpenChange, origId, original }: Props) {
  const [text, setText] = React.useState('')
  const { items, quote } = usePosts()

  // 원글 찾기(매 렌더에서 가벼운 탐색)
  const target = React.useMemo(() => {
    if (original) return original
    if (!origId) return null
    // repost의 경우 original 필드가 있을 수도 있으니 우선적으로 사용
    const p = items.find(p => p.id === origId) as any
    if (!p) return null
    return p.original ?? p
  }, [items, origId, original])

  const disabled = text.trim().length === 0 || !target

  function onSubmit() {
    if (!target) return
    // 실제 인용 게시 생성
    quote(target.id, text)
    // UX: 토스트는 store의 toastBus가 띄우도록(이미 구현돼 있음)
    onOpenChange(false)
    setText('')
  }

  return (
    <Dialog open={open} onOpenChange={(v)=>{ onOpenChange(v); if(!v) setText('') }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>인용 추가</DialogTitle>
        </DialogHeader>

        {/* 텍스트 입력 */}
        <Textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="댓글을 추가하세요…"
          className="min-h-[120px]"
          maxLength={280}
        />

        {/* 원글 미리보기 */}
        {target && (
          <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-sm">
            <div className="mb-1 font-semibold">
              {target.author?.name} <span className="text-slate-500">@{target.author?.username}</span>
            </div>
            <div className="text-[14px] leading-6">{target.content}</div>
            {Array.isArray(target.images) && target.images.length > 0 && (
              <img
                src={target.images[0]}
                alt=""
                className="mt-2 h-32 w-full rounded-lg object-cover"
                loading="lazy"
              />
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={onSubmit} disabled={disabled} className="rounded-3xl px-4">
            게시
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
