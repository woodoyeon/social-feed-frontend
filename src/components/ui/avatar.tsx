// src/components/ui/avatar.tsx
'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar(
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * - src가 없거나 빈 문자열이면 렌더하지 않음
 * - 이미지 로드 에러 시에도 렌더 중단 → AvatarFallback만 보이게
 * - 기존 기능/props는 유지
 */
export function AvatarImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const { src, onError, ...rest } = props
  const [errored, setErrored] = React.useState(false)

  if (!src || src === "" || errored) return null

  return (
    <img
      src={src}
      onError={(e) => {
        setErrored(true)
        onError?.(e)
      }}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  )
}

export function AvatarFallback(
  { children, className, ...props }: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div className={cn("text-xs text-slate-500 px-2", className)} {...props}>
      {children}
    </div>
  )
}
