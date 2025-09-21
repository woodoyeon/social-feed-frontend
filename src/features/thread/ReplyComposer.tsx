// src/features/thread/ReplyComposer.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePosts } from '@/store/usePosts'

type Props = {
  rootId: number
  parentId?: number
  onPosted?: () => void
  compact?: boolean
}

export default function ReplyComposer({ rootId, parentId, onPosted, compact }: Props) {
  const reply = usePosts((s) => s.reply)
  const [text, setText] = useState('')

  const disabled = text.trim().length === 0
  const onSubmit = () => {
    const v = text.trim()
    if (!v) return
    reply(rootId, v, parentId)
    setText('')
    onPosted?.()
  }

  return (
    <div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? '이 댓글에 답글 쓰기…' : '이 스레드에 답글 쓰기…'}
        maxLength={280}
        className={compact ? 'min-h-[64px] resize-none' : 'min-h-[88px] resize-none'}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setText('')}>
          취소
        </Button>
        <Button size="sm" disabled={disabled} onClick={onSubmit}>
          답글 게시
        </Button>
      </div>
    </div>
  )
}
