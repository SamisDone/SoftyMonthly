import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/**
 * Chunky sticker buttons: 2px ink border + hard offset shadow.
 * On press the button sinks into its shadow (the "squish").
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-ink font-display font-bold whitespace-nowrap shadow-hard outline-none select-none transition-[translate,scale,box-shadow,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[5px_6px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:scale-[0.97] active:shadow-[1px_1px_0_var(--ink)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-cherry text-paper",
        secondary: "bg-butter text-ink",
        outline: "bg-paper text-ink",
        periwinkle: "bg-periwinkle text-ink",
        sage: "bg-sage text-ink",
        ghost:
          "border-transparent bg-transparent text-ink shadow-none hover:translate-y-0 hover:bg-ink/5 hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none",
        link: "border-transparent bg-transparent text-ink underline decoration-cherry decoration-wavy underline-offset-4 shadow-none hover:translate-y-0 hover:shadow-none active:shadow-none",
      },
      size: {
        default: "h-11 px-5 text-base",
        sm: "h-9 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-14 px-7 text-lg",
        icon: "size-11",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
