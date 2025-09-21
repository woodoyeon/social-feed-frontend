'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { usePosts } from '@/store/usePosts'
import PostCard from './PostCard'
import ReplyComposer from '@/features/thread/ReplyComposer'
import { Button } from '@/components/ui/button'

type TreeNode = ReturnType<typeof toTree>[number]

export default function ThreadView({ postId }: { postId: number }) {
  const thread = usePosts((s) => s.threads[postId])
  const fetchThread = usePosts((s) => s.fetchThread)
  const loadMoreReplies = usePosts((s) => s.loadMoreReplies)

  const fetchedRef = useRef(false)
  const { ref, inView } = useInView({ rootMargin: '200px', threshold: 0 })

  // 최초 로드
  useEffect(() => {
    if (!postId || Number.isNaN(postId)) return
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchThread(postId)
  }, [postId, fetchThread])

  // 무한 스크롤 (바닥 감지)
  useEffect(() => {
    if (!postId || Number.isNaN(postId)) return
    if (inView && thread?.hasMore && !thread?.loading) {
      loadMoreReplies(postId)
    }
  }, [inView, thread?.hasMore, thread?.loading, loadMoreReplies, postId])

  // 항상 호출되는 useMemo (Hook 순서 안정)
  const tree = useMemo(() => toTree(thread?.replies ?? [], postId), [thread?.replies, postId])

  if (!postId || Number.isNaN(postId)) {
    return <div className="p-4 text-sm text-slate-500">유효하지 않은 스레드입니다.</div>
  }
  if (!thread?.root) {
    return <div className="p-4 text-sm text-slate-500">스레드를 불러오는 중…</div>
  }

  return (
    <section aria-label="스레드">
      {/* 루트 */}
      <PostCard post={thread.root} />

      {/* 루트 답글 작성 */}
      <div className="px-4 py-3 border-b border-divider">
        <ReplyComposer rootId={postId} />
      </div>

      {/* 트리 */}
      <div>
        <ReplyTree nodes={tree} rootId={postId} depth={0} />
        {thread.loading && <div className="p-6 text-sm text-muted">더 불러오는 중…</div>}
        {thread.hasMore && <div ref={ref} className="h-10" />}
      </div>
    </section>
  )
}

/* ---------- 트리 빌더 (안전장치 포함) ---------- */
function toTree(list: any[], rootId: number) {
  const byId = new Map<number, any>()
  const children = new Map<number, any[]>()

  for (const p of list) {
    byId.set(p.id, { ...p, children: [] })
    children.set(p.id, [])
  }

  const roots: any[] = []
  for (const p of list) {
    if (p.id === p.parentId) continue // 자기 자신 금지
    const node = byId.get(p.id)!
    const pid = p.parentId
    if (!pid || pid === rootId) {
      roots.push(node)
    } else if (byId.has(pid)) {
      const bucket = children.get(pid) || []
      bucket.push(node)
      children.set(pid, bucket)
    } else {
      // 부모를 아직 못 받았으면 루트에 임시 붙이기 (고아 방지)
      roots.push(node)
    }
  }

  // children 붙이기
  for (const [pid, kids] of children.entries()) {
    const parent = byId.get(pid)
    if (parent) parent.children = kids
  }

  // 순환/과도한 깊이 방지용 컷오프(안전)
  const MAX_DEPTH = 100
  pruneDepth(roots, 0, MAX_DEPTH)
  return roots as any[]
}

function pruneDepth(nodes: any[], depth: number, MAX_DEPTH: number) {
  if (depth >= MAX_DEPTH) {
    for (const n of nodes) n.children = []
    return
  }
  for (const n of nodes) {
    if (Array.isArray(n.children) && n.children.length) {
      pruneDepth(n.children, depth + 1, MAX_DEPTH)
    }
  }
}

/* ---------- 재귀 렌더러 ---------- */
function ReplyTree({ nodes, rootId, depth }: { nodes: TreeNode[]; rootId: number; depth: number }) {
  return (
    <ul className="space-y-0">
      {nodes.map((n, i) => (
        // 형제 레벨 유니크 키
        <li key={`${n.parentId ?? 'root'}-${n.id}-${i}`}>
          <div className="pl-4">
            <div className="border-l border-divider ml-2 pl-4">
              <PostCard post={n} />

              {/* 이 댓글에 대한 인라인 컴포저 */}
              <InlineReplyAction postId={rootId} parentId={n.id} />

              {n.children && n.children.length > 0 && (
                <div className="ml-6">
                  <ReplyTree nodes={n.children} rootId={rootId} depth={depth + 1} />
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function InlineReplyAction({ postId, parentId }: { postId: number; parentId: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="px-4 pb-2">
      {!open ? (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          이 댓글에 답글 달기
        </Button>
      ) : (
        <div className="mt-2">
          <ReplyComposer rootId={postId} parentId={parentId} compact onPosted={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
