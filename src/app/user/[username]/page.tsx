//src/app/user/[username]/page.tsx
import SidebarNav from '@/features/feed/SidebarNav'
import RightRail from '@/features/feed/RightRail'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ProfileTabs from './profile-tabs' // ✅ 클라이언트 컴포넌트

export default async function UserPage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  // 실제 값이 있으면 채우세요. 값이 없을 땐 AvatarImage 렌더하지 않음(빈 src 금지)
  const profileImageUrl: string | undefined = undefined

  return (
    <div
      className="
        mx-auto w-full max-w-7xl px-2 sm:px-4
        grid gap-3 md:gap-6
        grid-cols-1
        md:grid-cols-[220px_minmax(0,1fr)]
        xl:grid-cols-[240px_minmax(0,700px)_360px]
      "
    >
      {/* 좌측 사이드바(고정) */}
      <aside className="hidden md:block sticky top-2 self-start" aria-label="사이드 내비게이션">
        <SidebarNav />
      </aside>

      {/* 가운데 본문 */}
      <main className="min-w-0">
        <div className="mx-auto w-full max-w-[700px] p-6">
          {/* 프로필 헤더 */}
          <header className="flex items-center gap-4 border-b border-divider pb-4">
            <Avatar className="h-16 w-16">
              {profileImageUrl && <AvatarImage src={profileImageUrl} alt={username} />}
              <AvatarFallback>{username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">@{username}</h1>
              <p className="text-muted-foreground text-sm truncate">프로필 페이지 템플릿입니다.</p>
            </div>

            <div className="ml-auto">
              <Button className="rounded-full px-5">Follow</Button>
            </div>
          </header>

          {/* 탭(클라이언트 분리) */}
          <section className="mt-6">
            <ProfileTabs username={username} />
          </section>
        </div>
      </main>

      {/* 우측 패널(고정) */}
      <aside className="hidden xl:block sticky top-2 self-start" aria-label="우측 패널">
        <RightRail />
      </aside>
    </div>
  )
}
