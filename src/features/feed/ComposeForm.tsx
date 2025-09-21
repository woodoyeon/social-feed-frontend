//src/features/feed/ComposeForm.tsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import { usePosts } from '@/store/usePosts'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, BarChart3, Smile, Calendar, MapPin } from 'lucide-react'

type Props = {
  variant?: 'inline' | 'page'
  onSubmitted?: () => void
  quoteOf?: any
}

export default function ComposeForm({ variant = 'inline', onSubmitted, quoteOf }: Props) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  const prepend = usePosts((s) => s.prepend)
  const remain = 280 - text.length
  const disabled = remain < 0 || text.trim().length === 0

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function submit() {
    const newPost = {
      id: Date.now(),
      author: {
        name: '내 이름',
        username: 'myusername',
        profileImage: 'https://picsum.photos/40/40?random=99',
      },
      content: text,
      images: preview ? [preview] : [],
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      comments: 0,
      isLiked: false,
      isRetweeted: false,
      ...(quoteOf ? { type: 'quote', quotedId: quoteOf.id } : {}),
    }
    prepend(newPost as any)
    setText('')
    setFile(null)
    onSubmitted?.()
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!disabled) submit()
  }

  return (
    <form onSubmit={onSubmit} className="border-b px-4 py-3">
      {/* 인용 카드 */}
      {quoteOf && (
        <div className="mb-2 rounded-2xl border p-3 text-sm bg-slate-50 dark:bg-slate-900/40">
          <div className="font-semibold">@{quoteOf.author.username}</div>
          <div className="opacity-80 line-clamp-3">{quoteOf.content}</div>
        </div>
      )}

      {/* 입력창 */}
      <label htmlFor="compose" className="sr-only">게시물 작성</label>
      <Textarea
        id="compose"
        aria-label="게시물 작성"
        aria-describedby="compose-remaining"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !disabled) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="What’s happening?"
        maxLength={280}
        className="
          resize-none text-lg
          text-foreground placeholder:text-muted
          bg-surface border border-divider rounded-2xl
          focus-visible:ring-2 focus-visible:ring-[--color-ring]
        "
      />

      {/* 이미지 미리보기 */}
      {preview && (
        <img src={preview} alt="업로드된 이미지 미리보기" className="mt-2 rounded-2xl" loading="lazy" />
      )}

      {/* 툴바 */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <label className="cursor-pointer hover:opacity-80" aria-label="이미지 업로드">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </label>
          <BarChart3 className="h-5 w-5 opacity-50" aria-hidden="true" />
          <Smile className="h-5 w-5 opacity-50" aria-hidden="true" />
          <Calendar className="h-5 w-5 opacity-50" aria-hidden="true" />
          <MapPin className="h-5 w-5 opacity-50" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-3">
          <span
            id="compose-remaining"
            className={
              remain < 0 ? 'text-rose-500' : remain < 40 ? 'text-amber-600' : 'text-slate-500'
            }
          >
            {remain}
          </span>
          <Button disabled={disabled} className="rounded-3xl px-4">
            Post
          </Button>
        </div>
      </div>
    </form>
  )
}
