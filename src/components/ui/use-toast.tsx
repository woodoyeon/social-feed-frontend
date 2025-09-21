//src/components/ui/use-toast.tsx
"use client"

import * as React from "react"
import { ToastProvider, Toast, ToastViewport } from "./toast"

/** 토스트 메시지 타입 */
export type AppToast = {
  title?: string
  description?: string
}

/** ✅ 어디서든(스토어 포함) 호출 가능한 브릿지 */
export const toastBus: { show: (msg: AppToast) => void } = {
  show: () => {}, // Provider가 마운트되면 실제 함수로 대체
}

/** React 컴포넌트에서 쓰는 훅 (선택) */
type ToastContextType = { toast: (msg: AppToast) => void }
const ToastContext = React.createContext<ToastContextType | null>(null)
export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProviderCustom")
  return ctx
}

/** Provider: 실제 렌더 및 브릿지 연결 */
export function ToastProviderCustom({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = React.useState<AppToast[]>([])

  const toast = (msg: AppToast) => {
    setQueue(prev => [...prev, msg])
    setTimeout(() => setQueue(prev => prev.slice(1)), 3000)
  }

  // 브릿지를 실제 구현으로 연결
  React.useEffect(() => {
    toastBus.show = toast
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        <ToastViewport />
        {queue.map((t, i) => (
          <Toast key={i}>
            <div className="flex flex-col gap-1">
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm opacity-80">{t.description}</div>}
            </div>
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  )
}
