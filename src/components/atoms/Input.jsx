import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input