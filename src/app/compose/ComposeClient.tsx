// src/app/compose/ComposeClient.tsx
'use client'

import Header from '@/features/feed/Header'
import ComposeForm from '@/features/feed/ComposeForm'
import { useSearchParams } from 'next/navigation'

export default function ComposeClient() {
  const sp = useSearchParams()
  const draft = sp.get('draft') ?? ''

  return (
    <>
      <Header />
      <ComposeForm /* draft={draft} */ />
    </>
  )
}
