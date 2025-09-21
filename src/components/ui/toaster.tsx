//src/components/ui/toaster.tsx
"use client"

import * as React from "react"
import { ToastProviderCustom } from "./use-toast"

/** 앱 전체를 감싸는 Toaster Provider */
export function Toaster({ children }: { children: React.ReactNode }) {
  return <ToastProviderCustom>{children}</ToastProviderCustom>
}
