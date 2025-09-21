// src/features/feed/SidebarNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, MessageSquare, Bookmark, User, Feather, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/store/useNotifications'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Explore', icon: Search },
  { href: '/me', label: 'Profile', icon: User },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
]

export default function SidebarNav() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const unread = useNotifications(s => s.unread)

  useEffect(() => setMounted(true), [])

  return (
    <div className="flex h-full flex-col justify-between py-4">
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-4 rounded-3xl px-4 py-3 text-lg',
                'hover:bg-surface-2',
                active && 'font-semibold'
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {href === '/notifications' && unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full
                                   bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">{label}</span>
            </Link>
          )
        })}

        <Link href="/compose" className="block">
          <Button className="w-full rounded-3xl text-base py-3 bg-blue-500 dark:bg-sky-400 text-white hover:brightness-110">
            <Feather className="mr-2 h-5 w-5" />
            <span className="hidden lg:inline">Post</span>
          </Button>


        </Link>
      </nav>

      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label="테마 전환"
        aria-pressed={mounted ? (resolvedTheme === 'dark') : undefined}
        className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm hover:bg-surface-2"
        title={mounted ? (resolvedTheme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode') : 'Theme'}
      >
        <Moon className="h-5 w-5" />
        <span className="hidden lg:inline">
          {!mounted ? 'Theme' : resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
        </span>
      </button>
    </div>
  )
}
