//src/app/me/page.tsx

import Shell from '@/features/feed/Shell'
import MyFeed from '@/features/feed/MyFeed'
import ComposeForm from '@/features/feed/ComposeForm'

export default function Page(){
  return (
    <Shell>
      <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur z-10">
        <div className="border-b px-4 py-3 font-bold">내 홈</div>
      </div>
      <ComposeForm variant="inline" />
      <MyFeed />
    </Shell>
  )
}
