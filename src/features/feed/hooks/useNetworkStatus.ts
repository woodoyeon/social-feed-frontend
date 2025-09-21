// src/features/feed/hooks/useNetworkStatus.ts
'use client'
import { useEffect } from 'react'
import { usePosts } from '@/store/usePosts'

export function useNetworkStatus() {
  const setOffline = usePosts(s => s.setOffline)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update() // 첫 실행 시 현재 상태 반영
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [setOffline])
}
