
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cyan text-charcoalPrimary hover:bg-cyan/80",
        secondary:
          "border-transparent bg-charcoalSecondary text-charcoalTextPrimary hover:bg-charcoalSecondary/80",
        destructive:
          "border-transparent bg-charcoalDanger text-white hover:bg-charcoalDanger/80",
        outline: "text-charcoalTextPrimary border-white/20",
        success: "border-transparent bg-charcoalSuccess text-white hover:bg-charcoalSuccess/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
