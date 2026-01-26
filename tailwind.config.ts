import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        yellow: "linear-gradient(90deg,#f0d466,#d7af31)",
        "gradient-primary": "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
        "gradient-accent": "linear-gradient(90deg, #EC4899 0%, #F97316 100%)",
      },
    },
  },
  safelist: [
    {
      pattern:
        /bg-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
    {
      pattern:
        /border-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
    {
      pattern:
        /text-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
    {
      pattern:
        /fill-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
