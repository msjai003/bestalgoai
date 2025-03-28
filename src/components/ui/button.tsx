
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 active:scale-[0.98] duration-200",
  {
    variants: {
      variant: {
        default: "bg-cyan text-charcoalPrimary shadow-md hover:bg-cyan/90 hover:shadow-cyan/20 hover:shadow-lg",
        destructive:
          "bg-charcoalDanger text-white shadow-md hover:bg-charcoalDanger/90 hover:shadow-charcoalDanger/20 hover:shadow-lg",
        outline:
          "border border-gray-700 bg-transparent text-foreground hover:bg-accent/10 hover:text-cyan hover:border-cyan/40 shadow-sm",
        secondary:
          "bg-charcoalSecondary text-white border border-white/10 shadow-md hover:bg-charcoalSecondary/90 hover:border-cyan/20 hover:shadow-lg",
        ghost: "hover:bg-gray-800/40 hover:text-white",
        link: "text-cyan underline-offset-4 hover:underline",
        cyan: "bg-cyan text-charcoalPrimary shadow-md hover:bg-cyan/90 hover:shadow-cyan/20 hover:shadow-lg",
        gradient: "bg-gradient-to-r from-cyan to-cyan/90 text-charcoalPrimary shadow-md hover:shadow-cyan/20 hover:shadow-lg hover:from-cyan hover:to-cyan/80",
      },
      size: {
        default: "h-10 px-4 py-2 [&_svg]:size-4",
        sm: "h-8 rounded-md px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 rounded-md px-4 [&_svg]:size-4",
        lg: "h-10 rounded-md px-5 text-base [&_svg]:size-5",
        xl: "h-12 rounded-md px-6 text-base [&_svg]:size-5",
        icon: "h-9 w-9 rounded-md [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
