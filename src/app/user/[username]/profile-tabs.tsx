//src/app/user/[username]/profile-tabs.tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'
import UserProfileContent from './user-profile-content'

export default function ProfileTabs({ username }: { username: string }) {
  return (
    <Tabs.Root defaultValue="posts" className="w-full">
      {/* ✅ Likes 제거 → 2열 */}
      <Tabs.List className="grid grid-cols-2 text-sm border-b">
        <Tabs.Trigger
          value="posts"
          className="py-3 font-semibold data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
        >
          Posts
        </Tabs.Trigger>
        <Tabs.Trigger
          value="media"
          className="py-3 font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
        >
          Media
        </Tabs.Trigger>
      </Tabs.List>

      <div className="py-4">
        <UserProfileContent username={username} />
      </div>
    </Tabs.Root>
  )
}
