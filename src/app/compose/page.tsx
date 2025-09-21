// src/app/compose/page.tsx
import Shell from '@/features/feed/Shell'
import { Suspense } from 'react'
import ComposeClient from './ComposeClient'

export default function ComposePage() {
  return (
    <Shell>
      <Suspense fallback={null}>
        <ComposeClient />
      </Suspense>
    </Shell>
  )
}
