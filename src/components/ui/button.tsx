
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 active:scale-[0.98] duration-200 hover:scale-[1.03]",
  {
    variants: {
      variant: {
        default: "bg-cyan text-white shadow-md hover:bg-cyan/90 hover:shadow-cyan/20 hover:shadow-lg py-3 px-5",
        destructive:
          "bg-charcoalDanger text-white shadow-md hover:bg-charcoalDanger/90 hover:shadow-charcoalDanger/20 hover:shadow-lg",
        outline:
          "border border-cyan bg-transparent text-cyan hover:bg-accent/10 hover:text-cyan hover:border-cyan/40 shadow-sm",
        secondary:
          "bg-[#1F1F1F] text-cyan border border-cyan/30 shadow-sm hover:bg-charcoalSecondary/90 hover:border-cyan/70 hover:shadow-lg",
        ghost: "hover:bg-gray-800/40 hover:text-white",
        link: "text-cyan underline-offset-4 hover:underline",
        icon: "bg-[#2A2A2A] text-white hover:bg-[#383838] hover:shadow-cyan/10 h-11 w-11 p-0 rounded-full shadow-sm",
        gradient: "bg-gradient-to-r from-cyan to-cyan/80 text-white shadow-md hover:shadow-cyan/20 hover:shadow-lg hover:from-cyan hover:to-cyan/80 py-3 px-5",
        fab: "bg-gradient-to-r from-cyan to-cyan/90 text-white h-14 w-14 rounded-full shadow-lg hover:shadow-cyan/30 hover:shadow-xl hover:from-cyan hover:to-cyan/80 p-0",
      },
      size: {
        default: "h-12 px-5 py-3 [&_svg]:size-5",
        sm: "h-10 rounded-lg px-4 py-2 text-xs [&_svg]:size-4",
        md: "h-12 rounded-xl px-5 py-3 [&_svg]:size-5",
        lg: "h-14 rounded-xl px-6 py-4 text-base [&_svg]:size-6",
        xl: "h-16 rounded-xl px-7 py-4 text-lg [&_svg]:size-6",
        icon: "h-11 w-11 rounded-full p-0 [&_svg]:size-5",
        fab: "h-14 w-14 rounded-full p-0 [&_svg]:size-6",
      },
      width: {
        default: "w-auto",
        full: "w-full",
        icon: "w-11",
        fab: "w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  width?: "default" | "full" | "icon" | "fab"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
