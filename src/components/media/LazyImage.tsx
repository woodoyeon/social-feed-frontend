// src/components/media/LazyImage.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = Omit<ImageProps, 'loading'> & {
  /** 외곽 컨테이너 클래스 (rounded, h-*, overflow-hidden 등 전달) */
  containerClassName?: string
  /** 스켈레톤 표시 여부 */
  showSkeleton?: boolean
}

/** next/image: priority=false면 lazy, priority=true면 eager */
export default function LazyImage({
  containerClassName,
  showSkeleton = true,
  className,
  width,
  height,
  fill,
  priority,
  onLoad,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false)

  // width/height가 있으면 컨테이너에 aspect-ratio로 자리 예약
  const aspectStyle = useMemo(() => {
    if (fill) return undefined
    if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
      return { aspectRatio: `${width} / ${height}` } as React.CSSProperties
    }
    return undefined
  }, [width, height, fill])

  return (
    <div
      className={cn('relative block w-full overflow-hidden', containerClassName)}
      style={aspectStyle}
    >
      {showSkeleton && (
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800 transition-opacity',
            loaded && 'opacity-0'
          )}
        />
      )}

      <Image
        {...rest}
        {...(fill ? { fill: true } : { width, height })}
        {...(priority ? {} : { loading: 'lazy' })}
        priority={priority}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  )
}
