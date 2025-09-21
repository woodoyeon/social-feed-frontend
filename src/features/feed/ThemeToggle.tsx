
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
export default function ThemeToggle(){
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(()=> setMounted(true), [])
  if(!mounted) return null
  return (
    <button aria-label="테마 토글" className="rounded-md border px-2 py-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-500" onClick={()=> setTheme(theme==='dark' ? 'light' : 'dark')}>
      {theme==='dark' ? '🌞' : '🌙'}
    </button>
  )
}
