import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button — the three sanctioned variants from Daniele's Touch.
 * ---------------------------------------------------------------------------
 * - primary   : the ONE accent action per view (Cobalt fill + soft accent glow)
 * - secondary : bordered, white — for neutral/secondary actions
 * - ghost     : text-only accent — for low-emphasis actions
 *
 * All targets are >= 40px tall (tablet tap-friendly). `sm` stays >= 40px via
 * padding + line-height; use it only where space is genuinely tight.
 */

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "sm";
}

// Base: shared layout + the micro press-down interaction.
const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight " +
  "rounded-btn border border-transparent transition-[transform,box-shadow,background,border-color] " +
  "duration-150 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

// Per-variant classes. Only `primary` carries the accent.
const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink shadow-accent hover:brightness-105",
  secondary:
    "bg-bg text-ink border-border-2 shadow-sm hover:bg-surface hover:border-ink-3",
  ghost: "text-accent hover:bg-accent-weak",
};

// Sizes — both keep a comfortable tap height for a tablet.
const sizes = {
  md: "px-[18px] py-[11px] text-sm min-h-[44px]",
  sm: "px-[13px] py-[9px] text-[13px] min-h-[40px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});
