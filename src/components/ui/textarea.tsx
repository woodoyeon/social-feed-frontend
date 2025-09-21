
import * as React from "react"
import { cn } from "@/lib/utils"
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (<textarea ref={ref} className={cn("min-h-28 w-full rounded-md border p-3 text-sm bg-white dark:bg-slate-900", className)} {...props} />)
)
Textarea.displayName = "Textarea"
