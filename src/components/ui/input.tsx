
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-gray-700 bg-gray-800/80 px-3 py-2 text-base text-white ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
