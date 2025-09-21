
import { usePosts } from '@/store/usePosts'
export function usePostActions(){
  const like = usePosts(s=>s.like)
  const retweet = usePosts(s=>s.retweet)
  const toggleBookmark = usePosts(s=>s.toggleBookmark)
  const bookmarks = usePosts(s=>s.bookmarks)
  return { like, retweet, toggleBookmark, bookmarks }
}
