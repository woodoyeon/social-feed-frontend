// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import Shell from '@/features/feed/Shell'
import ComposeForm from '@/features/feed/ComposeForm'
import Feed from '@/features/feed/Feed'
import * as Tabs from '@radix-ui/react-tabs'
import { useNetworkStatus } from '@/features/feed/hooks/useNetworkStatus'
import { usePosts } from '@/store/usePosts'

export default function Page() {
  // 네트워크 상태 감지
  useNetworkStatus()
  const isOffline = usePosts(s => s.isOffline)
  const followings = usePosts(s => s.followings)

  // ★ 데모용: 팔로잉이 비어 있으면 'live' 자동 팔로우
  useEffect(() => {
    if (!followings?.length) {
      usePosts.setState({ followings: ['live'] })
    }
  }, [followings])

  return (
    <Shell>
      {/* 오프라인 안내 배너 */}
      {isOffline && (
        <div className="sticky top-0 z-50 bg-yellow-200 text-black text-center py-2">
          ⚠️ 오프라인 모드 — 캐시된 게시물만 표시됩니다.
        </div>
      )}

      {/* 탭 구조 */}
      <Tabs.Root defaultValue="foryou">
        {/* 상단 탭 바 */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur z-10">
          <Tabs.List className="grid grid-cols-2 text-[15px] border-b">
            <Tabs.Trigger
              value="foryou"
              className="py-3 font-bold 
                         data-[state=active]:border-b-4 
                         data-[state=active]:border-blue-600
                         data-[state=active]:text-foreground 
                         text-slate-500 hover:bg-slate-50 
                         dark:hover:bg-slate-900"
            >
              For you
            </Tabs.Trigger>
            <Tabs.Trigger
              value="following"
              className="py-3 font-bold 
                         data-[state=active]:border-b-4 
                         data-[state=active]:border-blue-600
                         data-[state=active]:text-foreground 
                         text-slate-500 hover:bg-slate-50 
                         dark:hover:bg-slate-900"
            >
              Following
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {/* 인라인 컴포저 */}
        <ComposeForm variant="inline" />

        {/* 탭 콘텐츠 */}
        <Tabs.Content value="foryou">
          <Feed mode="all" />
        </Tabs.Content>

        <Tabs.Content value="following">
          <Feed mode="following" followings={followings?.length ? followings : ['live']} />
        </Tabs.Content>
      </Tabs.Root>
    </Shell>
  )
}
