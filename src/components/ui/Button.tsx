import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Button — three variants per blueprint Section 4.4.
 * Renders as <a> when href is given (internal via next/link, external as <a>),
 * or <button> otherwise. Forwarded props preserve native behavior.
 */
type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Blueprint: bg #0D9488, white text, hover darken to #0F766E
  primary: "bg-teal-600 text-white hover:bg-teal-500",
  secondary: "bg-transparent text-navy-500 border-2 border-navy-500 hover:bg-navy-50",
  ghost: "bg-transparent text-teal-500 hover:bg-teal-50",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-base",
  lg: "px-9 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends CommonProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
        >
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  );
}
