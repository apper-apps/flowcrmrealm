import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = true,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      className={cn(
        "rounded-xl bg-white p-6 shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = "Card"

export default Card