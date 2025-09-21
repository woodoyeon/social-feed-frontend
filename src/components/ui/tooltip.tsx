import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({
  className, sideOffset = 6, ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { sideOffset?: number }) {
  return (
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white",
        "shadow-md ring-1 ring-black/10 dark:bg-slate-800", className
      )}
      {...props}
    />
  )
}
