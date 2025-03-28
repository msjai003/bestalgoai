
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Applying the Charcoal & Cyan theme color codes
        appBg: "#121212",      // Updated to Charcoal Primary Background
        surfaceBg: "#1F1F1F",  // Updated to Charcoal Secondary Background
        accentPink: "#00BCD4", // Updated to Cyan
        accentPurple: "#00BCD4", // Also updated to Cyan for consistency
        textPrimary: "#FFFFFF", // Primary Text
        textSecondary: "#B0B0B0", // Secondary Text
        success: "#4CAF50",    // Updated Success
        danger: "#F44336",     // Updated Danger
        
        // Charcoal & Cyan theme
        charcoalPrimary: "#121212",   // Primary Background
        charcoalSecondary: "#1F1F1F", // Secondary Background
        cyan: "#00BCD4",              // Accent (Cyan)
        charcoalTextPrimary: "#FFFFFF",    // Primary Text
        charcoalTextSecondary: "#B0B0B0",  // Secondary Text
        charcoalSuccess: "#4CAF50",        // Success
        charcoalDanger: "#F44336",         // Danger
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        "micro-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" }
        },
        "micro-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)" }
        },
        "micro-glow": {
          "0%": { boxShadow: "0 0 0 rgba(0, 188, 212, 0)" },
          "50%": { boxShadow: "0 0 10px rgba(0, 188, 212, 0.5)" },
          "100%": { boxShadow: "0 0 0 rgba(0, 188, 212, 0)" }
        },
        "image-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "soft-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(1deg)" },
          "75%": { transform: "rotate(-1deg)" },
          "100%": { transform: "rotate(0deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "micro-bounce": "micro-bounce 1s ease-in-out infinite",
        "micro-scale": "micro-scale 0.3s ease-in-out",
        "micro-glow": "micro-glow 2s ease-in-out infinite",
        "image-float": "image-float 3s ease-in-out infinite",
        "soft-rotate": "soft-rotate 3s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
