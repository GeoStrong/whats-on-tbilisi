import type { Config } from "tailwindcss";
import { colors, radius } from "../../packages/config/tailwind.tokens";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/shared/src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        background: colors.background,
        foreground: colors.foreground,
        card: colors.card,
        "card-foreground": colors.cardForeground,
        primary: colors.primary,
        "primary-foreground": colors.primaryForeground,
        secondary: colors.secondary,
        "secondary-foreground": colors.secondaryForeground,
        muted: colors.muted,
        "muted-foreground": colors.mutedForeground,
        accent: colors.accent,
        "accent-foreground": colors.accentForeground,
        success: colors.success,
        destructive: colors.destructive,
        "destructive-foreground": colors.destructiveForeground,
        border: colors.border,
        input: colors.input,
        ring: colors.ring,
      },
      borderRadius: {
        lg: radius.lg,
        md: radius.md,
        sm: radius.sm,
      },
    },
  },
  plugins: [],
} satisfies Config;
