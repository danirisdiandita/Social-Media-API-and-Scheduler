import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wide transition-all",
  {
    variants: {
      variant: {
        default: "bg-[#FFE66D] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        destructive: "bg-[#FF6B6B] text-white hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        success: "bg-[#B4F8C8] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        outline: "bg-white hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
