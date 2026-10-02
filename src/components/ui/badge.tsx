import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/** Little printed stickers: ink outline, tiny hard shadow, chunky caps. */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border-2 border-ink px-3 py-0.5 font-display text-xs font-extrabold tracking-wider whitespace-nowrap uppercase shadow-hard-sm [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-butter text-ink",
        cherry: "bg-cherry text-paper",
        periwinkle: "bg-periwinkle text-ink",
        sage: "bg-sage text-ink",
        blush: "bg-blush text-ink",
        outline: "bg-paper text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
