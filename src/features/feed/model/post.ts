// src/features/feed/model/post.ts
export type Post = {
  id: number
  author: {
    name: string
    username: string
    profileImage: string
    verified?: boolean
  }
  content: string
  images: string[]
  createdAt: string
  likes: number
  retweets: number
  comments: number
  isLiked: boolean
  isRetweeted: boolean

  /** 스레드(댓글)용: 이 글이 달린 루트 글 id (루트글은 undefined) */
  parentId?: number

  /** 인용/리포스트 카드 호환 */
  type?: 'repost' | 'quote'
  quotedId?: number
  quoted?: Post
  repostedBy?: { name: string; username: string; profileImage: string }
  original?: Post
}
