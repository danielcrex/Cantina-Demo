import type { Config } from "tailwindcss";

/**
 * Tailwind bound to the "Daniele's Touch" design system.
 * ---------------------------------------------------------------------------
 * These values mirror the tokens in `danieles-touch-styleguide.html` EXACTLY,
 * so Tailwind utilities map 1:1 to the design system (e.g. `bg-bg`, `text-ink`,
 * `border-border`, `rounded-card`, `shadow-sm`, `text-accent`).
 *
 * The same tokens are ALSO published as raw CSS variables in `src/index.css`.
 * We intentionally hard-code the literal values here (rather than pointing at
 * `var(--...)`) so that opacity modifiers and JIT colour math work correctly.
 * Keep the two files in sync: this file is the Tailwind surface, index.css is
 * the CSS-variable surface.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Spacing is redefined on the 4px scale from the style guide (s1…s8).
    // We keep Tailwind's numeric ramp intact and add named aliases so both
    // `p-4` (16px) and `p-s4` read naturally.
    extend: {
      colors: {
        // Neutral foundation (fixed)
        bg: "#FFFFFF",
        surface: "#FAFBFC",
        "surface-2": "#F3F5F8",
        border: "#ECEEF2",
        "border-2": "#DEE2E9",
        ink: "#0E1116",
        "ink-2": "#4B525C",
        "ink-3": "#858C97",

        // Accent group (Cobalt — the sanctioned default accent)
        accent: {
          DEFAULT: "#2B54F0",
          ink: "#FFFFFF",
          weak: "#ECEFFE",
        },

        // Semantic (fixed)
        positive: { DEFAULT: "#0B8A5F", weak: "#E6F5EF" },
        warning: { DEFAULT: "#B7791F", weak: "#FBF1E0" },
        danger: { DEFAULT: "#D64541", weak: "#FCEBEA" },
      },

      // Accent glow used by the primary button shadow.
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,40,.04),0 1px 3px rgba(16,24,40,.05)",
        md: "0 4px 10px rgba(16,24,40,.05),0 2px 4px rgba(16,24,40,.04)",
        lg: "0 16px 40px rgba(16,24,40,.10),0 4px 10px rgba(16,24,40,.05)",
        accent: "0 4px 14px rgba(43,84,240,.28)",
      },

      borderRadius: {
        card: "14px",
        btn: "10px",
        input: "10px",
        pill: "999px",
      },

      fontFamily: {
        // One family everywhere (display / body / number all Figtree),
        // self-hosted so the app works fully offline.
        display: ["Figtree", "sans-serif"],
        body: ["Figtree", "sans-serif"],
        number: ["Figtree", "sans-serif"],
      },

      letterSpacing: {
        display: "-0.03em",
        tight: "-0.02em",
      },

      // Named 4px-scale aliases (spacing already contains the numeric ramp).
      spacing: {
        s1: "4px",
        s2: "8px",
        s3: "12px",
        s4: "16px",
        s5: "24px",
        s6: "32px",
        s7: "48px",
        s8: "72px",
      },

      maxWidth: {
        content: "1080px",
      },

      fontFeatureSettings: {
        tnum: '"tnum" 1, "lnum" 1',
      },
    },
  },
  plugins: [],
};

export default config;
