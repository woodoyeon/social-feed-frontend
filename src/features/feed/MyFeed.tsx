//src/features/feed/MyFeed.tsx
'use client'
import { useMemo } from 'react'
import { usePosts } from '@/store/usePosts'
import PostCard from './PostCard'
import { currentUser } from '@/lib/currentUser'

export default function MyFeed(){
  const { items } = usePosts()
  const mine = useMemo(()=> {
    return items.filter((p:any) =>
      p.author?.username === currentUser.username ||
      p.type === 'repost' && p.repostedBy?.username === currentUser.username ||
      p.type === 'quote'  && p.author?.username === currentUser.username
    )
  }, [items])

  return (
    <div>
      {mine.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  )
}
