import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — dual-mode (link when href, native button otherwise).
 * Engineering-Luxury dark styling. Preserves the href API the rest of the
 * codebase uses (shadcn's ButtonPrimitive is button-only; we keep links).
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-button text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-teal-700 text-white hover:bg-teal-600 glow-teal",
        secondary:
          "border border-white/15 bg-white/5 text-white hover:bg-white/10",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
        destructive: "bg-red-500/15 text-red-300 hover:bg-red-500/25",
        link: "text-teal-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-[0.8rem]",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

interface ButtonAsLink extends ButtonProps {
  href: string;
  external?: boolean;
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant, size, className, children } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick, disabled, ...rest } = props as ButtonAsButton;
  const ariaLabel = rest["aria-label"];
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}

export { buttonVariants };
