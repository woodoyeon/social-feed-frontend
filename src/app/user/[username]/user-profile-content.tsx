//src/app/user/[username]/user-profile-content.tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { useMemo } from 'react'
import { usePosts } from '@/store/usePosts'
import PostCard from '@/features/feed/PostCard'

export default function UserProfileContent({ username }: { username: string }) {
  const items = usePosts(s => s.items)

  const { postsByUser, mediaByUser } = useMemo(() => {
    const postsByUser = items.filter(p => p.author?.username === username)
    const mediaByUser = postsByUser.filter(
      p => Array.isArray(p.images) && p.images.length > 0
    )
    return { postsByUser, mediaByUser }
  }, [items, username])

  return (
    <>
      {/* Posts */}
      <Tabs.Content value="posts" className="space-y-0">
        {postsByUser.length === 0 ? (
          <Empty message="아직 이 유저의 게시글이 없어요." />
        ) : (
          postsByUser.map(post => <PostCard key={post.id} post={post as any} />)
        )}
      </Tabs.Content>

      {/* Media */}
      <Tabs.Content value="media" className="space-y-0">
        {mediaByUser.length === 0 ? (
          <Empty message="이 유저가 올린 미디어 게시글이 없어요." />
        ) : (
          mediaByUser.map(post => <PostCard key={post.id} post={post as any} />)
        )}
      </Tabs.Content>
    </>
  )
}

function Empty({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-divider p-6 text-sm text-muted-foreground">
      <p>{message}</p>
      {hint && <p className="mt-1 text-xs">{hint}</p>}
    </div>
  )
}
