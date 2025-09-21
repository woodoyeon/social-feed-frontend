// src/features/feed/Shell.tsx
'use client'
import React from 'react'
import SidebarNav from './SidebarNav'
import RightRail from './RightRail'
import { cn } from '@/lib/utils'

type ShellProps = {
  children: React.ReactNode
  /** 왼쪽 사이드바 숨기기 (기본: false = 표시) */
  hideSidebar?: boolean
  /** 오른쪽 패널 숨기기 (기본: false = 표시) */
  hideRightRail?: boolean
  /** 센터 영역 최대폭 (px). 기본 600, 필요시 800으로 넓게 */
  centerMax?: 600 | 800
}

export default function Shell({
  children,
  hideSidebar = false,
  hideRightRail = false,
  centerMax = 600,
}: ShellProps) {
  // grid 템플릿 구성
  const gridTemplate = (() => {
    // 기본(좌/중/우)
    if (!hideSidebar && !hideRightRail) {
      return 'grid-cols-1 md:grid-cols-[80px_minmax(0,600px)] lg:grid-cols-[275px_minmax(0,600px)_350px]'
    }
    // 좌+중 (우 숨김)
    if (!hideSidebar && hideRightRail) {
      // 우측을 안 쓰니 센터를 넓혀 보기 좋게
      return `grid-cols-1 md:grid-cols-[80px_minmax(0,${centerMax}px)] lg:grid-cols-[275px_minmax(0,${centerMax}px)]`
    }
    // 중+우 (좌 숨김)
    if (hideSidebar && !hideRightRail) {
      return `grid-cols-1 lg:grid-cols-[minmax(0,${centerMax}px)_350px]`
    }
    // 풀-센터(좌/우 둘 다 숨김)
    return 'grid-cols-1'
  })()

  // 메인 보더 방향
  const mainBorder = (() => {
    if (!hideSidebar && !hideRightRail) return 'border-x'
    if (!hideSidebar && hideRightRail) return 'border-l'
    if (hideSidebar && !hideRightRail) return 'border-r'
    return 'border-0'
  })()

  return (
    <div
      className={cn(
        'mx-auto max-w-[1300px] grid gap-6',
        gridTemplate
      )}
    >
      {/* 스킵 링크 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 
                   bg-black text-white px-3 py-2 rounded"
      >
        본문으로 건너뛰기
      </a>

      {/* Left */}
      {!hideSidebar && (
        <aside className="hidden md:block sticky top-0 h-screen px-2" aria-label="사이드 내비게이션">
          <SidebarNav />
        </aside>
      )}

      {/* Center */}
      <main
        id="main"
        className={cn(
          'min-h-screen text-[15px] leading-6',
          mainBorder,
          'border-slate-200 dark:border-slate-800'
        )}
      >
        {children}
      </main>

      {/* Right */}
      {!hideRightRail && (
        <aside className="hidden lg:block sticky top-0 h-screen pr-2" aria-label="우측 패널">
          <RightRail />
        </aside>
      )}
    </div>
  )
}
