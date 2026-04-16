import type { Config } from "tailwindcss";

/**
 * Tailwind theme mapped to freeCodeCamp's Command-line Chic tokens.
 * See .claude/skills/command-line-chic/SKILL.md for the source of truth.
 *
 * Components should reference SEMANTIC class names (bg-surface, text-primary,
 * border-subtle) — not raw gray-85, gray-90, etc. — so light-mode swapping
 * works cleanly by just flipping which token the semantic name points to
 * via CSS variables in globals.css.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Raw tokens — only for exceptional cases. Prefer semantic tokens below.
        "cc-gray-90": "#0a0a23",
        "cc-gray-85": "#1b1b32",
        "cc-gray-80": "#2a2a40",
        "cc-gray-75": "#3b3b4f",
        "cc-gray-45": "#858591",
        "cc-gray-15": "#d0d0d5",
        "cc-gray-10": "#dfdfe2",
        "cc-gray-05": "#f5f6f7",
        "cc-gray-00": "#ffffff",
        "cc-purple": "#dbb8ff",
        "cc-yellow": "#f1be32",
        "cc-blue": "#99c9ff",
        "cc-blue-mid": "#198eee",
        "cc-green": "#acd157",
        "cc-red": "#ffadad",

        // Semantic tokens — prefer these in components.
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-border": "var(--surface-border)",
        muted: "var(--muted)",
        "fg-subtle": "var(--fg-subtle)",
        "fg-secondary": "var(--fg-secondary)",
        fg: "var(--fg)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        focus: "var(--focus)",
      },
      fontFamily: {
        // Hack-ZeroSlash via @fontsource/hack would be ideal; for v1 we use a
        // system-mono fallback stack. Swap in Hack once font assets are wired.
        mono: [
          "Hack-ZeroSlash",
          "Fira Mono",
          "Menlo",
          "Consolas",
          "ui-monospace",
          "monospace",
        ],
        sans: [
          "Lato",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        // Command-line Chic mandates 18px minimum. Base bumped accordingly.
        base: ["1.125rem", { lineHeight: "1.5" }], // 18px
      },
    },
  },
  plugins: [],
};

export default config;
