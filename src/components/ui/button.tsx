import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 border-2 border-black",
  {
    variants: {
      variant: {
        default: "bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF]",
        destructive:
          "bg-[#FF6B6B] hover:bg-[#FF5252] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#FF3838]",
        outline:
          "bg-white hover:bg-gray-100 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-gray-200",
        secondary:
          "bg-[#FFE66D] hover:bg-[#FFD93D] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#FFC700]",
        ghost:
          "bg-[#B4F8C8] hover:bg-[#A0E7B8] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#8CD9A8]",
        link: "border-0 bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2.5 has-[>svg]:px-3",
        sm: "h-10 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-14 px-6 has-[>svg]:px-4",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "none",
    },
  }
)

function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
