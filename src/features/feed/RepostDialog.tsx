// src/features/feed/RepostDialog.tsx
'use client'

import * as React from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePosts } from '@/store/usePosts'
import { Repeat2, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

// (선택) shadcn toast를 쓰는 경우
// import { useToast } from '@/components/ui/use-toast'

type Props = {
  postId: number
  open: boolean
  onOpenChange: (v: boolean) => void
  onQuote: () => void
}

export default function RepostDialog({ postId, open, onOpenChange, onQuote }: Props) {
  const repostFromHook = usePosts((s) => (s as any).repost) as
    | ((id: number) => void | Promise<void>)
    | undefined

  // const { toast } = useToast() // (선택)

  const runRepost = React.useCallback(async () => {
    try {
      // 1) 우선 훅에서 가져온 액션 사용
      let fn = repostFromHook

      // 2) 훅에 없으면 getState()로 백업 플랜
      if (!fn && (usePosts as any).getState) {
        const st = (usePosts as any).getState()
        fn =
          st.repost ??
          st.retweet ??        // 다른 이름일 가능성 대비
          st.toggleRepost ??
          st.share
      }

      if (!fn) {
        console.warn('[RepostDialog] repost action not found in store')
        // toast?.({ variant: 'destructive', title: '재게시 실패', description: 'repost 액션이 스토어에 없습니다.' })
        return
      }

      const res = fn(postId)
      if (res && typeof (res as any).then === 'function') {
        await res
      }

      // toast?.({ title: '재게시 완료', description: '타임라인에 공유했어요.' })
      onOpenChange(false)
    } catch (e) {
      console.error('[RepostDialog] repost failed:', e)
      // toast?.({ variant: 'destructive', title: '재게시 실패', description: String(e) })
    }
  }, [postId, onOpenChange, repostFromHook])

  // --- 키보드 포커스/네비게이션 (이전 답변과 동일) ---
  const primaryRef = React.useRef<HTMLButtonElement | null>(null)
  const secondaryRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => primaryRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  const handleKeyNav: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const a = primaryRef.current
      const b = secondaryRef.current
      const active = document.activeElement
      if (!a || !b) return
      if (e.key === 'ArrowDown') (active === a ? b : a).focus()
      else (active === b ? a : b).focus()
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const el = document.activeElement as HTMLButtonElement | null
      el?.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby="repost-dialog-title"
        onKeyDown={handleKeyNav}
        className={cn(
          'sm:max-w-sm p-0 overflow-hidden',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
        )}
      >
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle id="repost-dialog-title" className="text-base font-semibold">
            리트윗
          </DialogTitle>
          <DialogDescription className="text-xs">
            바로 공유하거나 코멘트를 덧붙여 인용할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pb-5">
          <Button
            ref={primaryRef}
            type="button"
            className="w-full justify-between rounded-xl py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={runRepost}
            aria-label="이 게시물을 재게시하기"
          >
            <span className="flex items-center gap-2">
              <Repeat2 className="size-4" aria-hidden />
              재게시
            </span>
            <span className="text-[11px] opacity-80">바로 공유</span>
          </Button>

          <div className="my-2 h-px w-full bg-border" />

          <Button
            ref={secondaryRef}
            type="button"
            variant="outline"
            className="w-full justify-between rounded-xl py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => {
              onOpenChange(false)
              onQuote()
            }}
            aria-label="이 게시물을 인용하기"
          >
            <span className="flex items-center gap-2">
              <Quote className="size-4" aria-hidden />
              인용하기
            </span>
            <span className="text-[11px] opacity-80">코멘트 추가</span>
          </Button>

          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
