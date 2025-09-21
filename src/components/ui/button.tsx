//components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "ghost" | "secondary" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
      "disabled:opacity-50 disabled:pointer-events-none"

    const variantClass =
      variant === "ghost"
        ? "bg-transparent hover:bg-slate-100 text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
        : variant === "secondary"
        ? "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        : variant === "outline"
        ? "border bg-transparent hover:bg-slate-100 text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100"
        : /* default */
          "bg-blue-600 text-white hover:bg-blue-700"

    const sizeClass =
      size === "sm"
        ? "h-8 px-2 py-1"
        : size === "lg"
        ? "h-11 px-5"
        : size === "icon"
        ? "h-9 w-9"
        : /* md */
          "h-9 px-3 py-2"

    return (
      <Comp
        ref={ref}
        className={cn(base, variantClass, sizeClass, className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
