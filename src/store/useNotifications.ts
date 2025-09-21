//src/store/useNotifications.ts
'use client'
import { create } from 'zustand'

export type NotiType = 'like' | 'bookmark' | 'mention' | 'repost' | 'comment'

export type NotificationItem = {
  id: number
  type: NotiType
  text: string
  createdAt: string
  read: boolean
  link?: string
}

type S = {
  items: NotificationItem[]
  unread: number
  push: (n: NotificationItem) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotifications = create<S>((set) => ({
  items: [],
  unread: 0,
  push: (n) => set((s) => ({ items: [n, ...s.items], unread: s.unread + 1 })),
  markAllRead: () =>
    set((s) => ({ unread: 0, items: s.items.map(i => ({ ...i, read: true })) })),
  clear: () => set({ items: [], unread: 0 }),
}))
