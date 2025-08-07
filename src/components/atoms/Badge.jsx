import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 border-primary-200",
    success: "bg-gradient-to-r from-accent-100 to-emerald-100 text-accent-800 border-accent-200",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200",
    danger: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200"
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge