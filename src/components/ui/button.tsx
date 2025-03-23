
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-[1px] btn-hover-effect",
  {
    variants: {
      variant: {
        default: "bg-cyan text-charcoalPrimary hover:bg-cyan/90 hover:shadow-[0_0_10px_rgba(0,188,212,0.5)]",
        destructive:
          "bg-charcoalDanger text-white hover:bg-charcoalDanger/90 hover:shadow-[0_0_10px_rgba(244,67,54,0.5)]",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground hover:border-cyan/50",
        secondary:
          "bg-charcoalSecondary text-charcoalTextPrimary border border-white/10 hover:bg-charcoalSecondary/80 hover:border-cyan/20",
        ghost: "hover:bg-charcoalSecondary hover:text-charcoalTextPrimary",
        link: "text-cyan underline-offset-4 hover:underline",
        cyan: "bg-cyan text-charcoalPrimary hover:bg-cyan/90 hover:shadow-[0_0_10px_rgba(0,188,212,0.5)]",
        gradient: "bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary hover:from-cyan/90 hover:to-cyan/70 hover:shadow-[0_0_15px_rgba(0,188,212,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
