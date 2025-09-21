//src/features/feed/PostCard.tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Repeat2, Heart, Bookmark } from 'lucide-react'
import { fromNow } from '@/lib/time'
import { renderContent } from '@/lib/renderContent'
import { usePostActions } from './hooks/usePostActions'
import type { Post } from './model/post'
import { cn } from '@/lib/utils'
import RepostDialog from './RepostDialog'
import { usePosts } from '@/store/usePosts'
import LazyImage from '@/components/media/LazyImage'

function MediaGrid({
  images,
  onOpen,
}: {
  images: string[]
  onOpen: (index: number) => void
}) {
  const imgs = images.slice(0, 4)

  // 1장
  if (imgs.length === 1) {
    return (
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="block w-full rounded-2xl overflow-hidden"
        aria-label="이미지 확대"
      >
        <LazyImage
          src={imgs[0]}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          containerClassName="relative w-full rounded-2xl overflow-hidden aspect-[16/9]"
          className="object-cover"
        />
      </button>
    )
  }

  // 2장
  if (imgs.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {imgs.map((src, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onOpen(i)}
            className="rounded-xl overflow-hidden"
            aria-label={`이미지 ${i + 1} 확대`}
          >
            <LazyImage
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 400px"
              containerClassName="relative h-64 w-full rounded-xl overflow-hidden"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    )
  }

  // 3~4장 (왼쪽 세로 1 + 오른쪽 2)
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="rounded-xl row-span-2 overflow-hidden"
        aria-label="이미지 1 확대"
      >
        <LazyImage
          src={imgs[0]}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          containerClassName="relative h-[328px] w-full rounded-xl overflow-hidden"
          className="object-cover"
        />
      </button>

      <button
        type="button"
        onClick={() => onOpen(1)}
        className="rounded-xl overflow-hidden"
        aria-label="이미지 2 확대"
      >
        <LazyImage
          src={imgs[1]}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 400px"
          containerClassName="relative h-40 w-full rounded-xl overflow-hidden"
          className="object-cover"
        />
      </button>

      <button
        type="button"
        onClick={() => onOpen(2)}
        className="rounded-xl overflow-hidden"
        aria-label="이미지 3 확대"
      >
        <LazyImage
          src={imgs[2] ?? imgs[1]}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 400px"
          containerClassName="relative h-40 w-full rounded-xl overflow-hidden"
          className="object-cover"
        />
      </button>
    </div>
  )
}

/** 인용 작성 미니 컴포저 (인라인) */
function QuoteComposer({
  postId,
  onClose,
  originalPreview,
}: {
  postId: number
  onClose: () => void
  originalPreview?: Post | any
}) {
  const quote = usePosts((s) => s.quote)
  const [text, setText] = useState('')
  const remain = 280 - text.length
  const disabled = remain < 0 || text.trim().length === 0

  return (
    <div className="mt-3 rounded-2xl border border-divider p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="코멘트를 추가하세요… (인용)"
        maxLength={280}
        className="min-h-[80px] resize-none bg-surface-2 border border-divider focus-visible:ring-2 focus-visible:ring-[--color-ring]"
      />

      {originalPreview && (
        <div className="mt-3 rounded-xl border border-divider p-3 text-sm bg-surface">
          <div className="mb-1 font-semibold">
            {originalPreview.author?.name}{' '}
            <span className="text-muted">@{originalPreview.author?.username}</span>
          </div>
          <div className="text-[14px] leading-6">{originalPreview.content}</div>
          {Array.isArray(originalPreview.images) && originalPreview.images.length > 0 && (
            <LazyImage
              src={originalPreview.images[0]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              containerClassName="relative mt-2 h-32 w-full rounded-lg overflow-hidden"
              className="object-cover"
            />
          )}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className={cn(remain < 0 ? 'text-rose-500' : remain < 40 ? 'text-amber-600' : 'text-muted')}>
          {remain}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button
            size="sm"
            disabled={disabled}
            onClick={() => {
              quote(postId, text)
              onClose()
            }}
          >
            인용 게시
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PostCard({ post }: { post: Post }) {
  const { like, toggleBookmark, bookmarks } = usePostActions()
  const [anim, setAnim] = useState(false)
  const [imgOpen, setImgOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [openRepost, setOpenRepost] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)

  const isRepost = (post as any)?.type === 'repost'
  const original = useMemo(() => ((post as any)?.original ?? post) as any, [post])
  const quoteTargetId = original?.id ?? post.id

  const isBookmarked = bookmarks.includes(post.id)
  const isLiked = post.isLiked
  const isRetweeted = post.isRetweeted

  function onLike() {
    setAnim(true)
    setTimeout(() => setAnim(false), 300)
    like(post.id)
  }
  function openImage(i: number) {
    setActiveIndex(i)
    setImgOpen(true)
  }

  const isQuote = (post as any)?.type === 'quote'
  const quoted = (post as any)?.quoted

  return (
    <article className="px-4 py-2.5 border-b border-divider">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          {/* shadcn AvatarImage는 내부적으로 <img> */}
          <AvatarImage
            src={post.author.profileImage}
            alt={post.author.name}
            loading="lazy"
            decoding="async"
          />
          <AvatarFallback>{post.author.name?.[0] ?? 'U'}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          {isRepost && (
            <div className="text-xs text-muted mb-1">
              {(post as any)?.repostedBy?.name ?? '누군가'} 님이 리트윗했습니다
            </div>
          )}

          <div className="flex items-center gap-2 text-[15px] leading-6 text-muted">
            <span className="font-semibold text-foreground">{post.author.name}</span>
            <span className="align-middle">
              {renderContent(`@${post.author.username}`)}
            </span>
            <time dateTime={post.createdAt} aria-label={`작성 시간 ${fromNow(post.createdAt)}`}>
              · {fromNow(post.createdAt)}
            </time>
          </div>


          <p className="mt-1 text-[15px] leading-6 break-words">
            {renderContent(post.content)}
          </p>

          {post.images?.length > 0 && (
            <>
              <div className="mt-2">
                <MediaGrid images={post.images} onOpen={openImage} />
              </div>

              <Dialog open={imgOpen} onOpenChange={setImgOpen}>
                <DialogContent className="p-0 border-0 bg-transparent shadow-none">
                  <DialogTitle className="sr-only">이미지 보기</DialogTitle>
                  <DialogDescription className="sr-only">
                    선택한 이미지를 크게 보여주는 모달입니다.
                  </DialogDescription>

                  {/* 모달은 클릭 후 즉시 표시가 좋아서 eager로 두어도 OK */}
                  <img
                    src={post.images[activeIndex]}
                    alt="확대 이미지"
                    className="max-h-[85vh] max-w-[90vw] rounded-2xl"
                    decoding="async"
                  />
                  <button
                    type="button"
                    onClick={() => setImgOpen(false)}
                    className="mt-2 inline-flex items-center rounded px-3 py-1 text-sm bg-slate-800 text-white
                               focus-visible:outline-none focus-visible:ring-2"
                    aria-label="이미지 닫기"
                  >
                    닫기
                  </button>
                </DialogContent>
              </Dialog>
            </>
          )}

          {isQuote && quoted && (
            <div className="mt-3 rounded-xl border border-divider p-3 text-sm bg-surface">
              <div className="mb-1 font-semibold">
                {quoted.author?.name}{' '}
                <span className="text-muted">@{quoted.author?.username}</span>
              </div>
              <div className="text-[14px] leading-6">{quoted.content}</div>
              {Array.isArray(quoted.images) && quoted.images.length > 0 && (
                <LazyImage
                  src={quoted.images[0]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  containerClassName="relative mt-2 h-32 w-full rounded-lg overflow-hidden"
                  className="object-cover"
                />
              )}
            </div>
          )}

          {/* 액션바 */}
          <div className="mt-2 grid grid-cols-4 pr-6 text-sm text-muted">
            <Button
              variant="ghost"
              size="sm"
              aria-label="댓글 보기"
              className="justify-start gap-1.5 hover:bg-surface-2"
              asChild
            >
              <Link
                href={`/thread/${post.id}`}
                aria-label={`댓글 보기 (댓글 ${post.comments}개)`}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-2
                           focus-visible:outline-none focus-visible:ring-2"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span className="tabular-nums">{post.comments}</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              aria-label="리트윗"
              className={cn(
                'justify-start gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
                isRetweeted && 'text-emerald-600'
              )}
              onClick={() => setOpenRepost(true)}
              aria-pressed={isRetweeted}
              aria-haspopup="dialog"
              aria-expanded={openRepost}
            >
              <Repeat2 className={cn('h-4 w-4', isRetweeted && 'text-emerald-600')} />
              <span className="tabular-nums">{post.retweets}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              aria-label="좋아요"
              className={cn(
                'justify-start gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/20',
                isLiked && 'text-rose-600',
                anim && 'like-pop'
              )}
              onClick={onLike}
              aria-pressed={isLiked}
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
              <span className="tabular-nums">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              aria-label="북마크"
              className="justify-start gap-1 hover:bg-surface-2"
              onClick={() => toggleBookmark(post.id)}
              aria-pressed={isBookmarked}
            >
              <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
            </Button>
          </div>

          <RepostDialog
            postId={quoteTargetId}
            open={openRepost}
            onOpenChange={setOpenRepost}
            onQuote={() => setOpenQuote(true)}
          />

          {openQuote && (
            <QuoteComposer
              postId={quoteTargetId}
              onClose={() => setOpenQuote(false)}
              originalPreview={original}
            />
          )}
        </div>
      </div>
    </article>
  )
}
