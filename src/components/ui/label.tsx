import * as React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-bold uppercase tracking-wide",
        className
      )}
      {...props}
    />
  );
}

export { Label };
