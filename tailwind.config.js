/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(215 27% 17%)",
        input: "hsl(215 27% 17%)",
        ring: "hsl(216 12% 84%)",
        background: "hsl(224 71% 4%)",
        foreground: "hsl(210 20% 98%)",
        primary: {
          DEFAULT: "hsl(210 20% 98%)",
          foreground: "hsl(220 9% 46%)",
        },
        secondary: {
          DEFAULT: "hsl(215 27% 17%)",
          foreground: "hsl(210 20% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(215 27% 17%)",
          foreground: "hsl(217 10% 65%)",
        },
        accent: {
          DEFAULT: "hsl(215 27% 17%)",
          foreground: "hsl(210 20% 98%)",
        },
        popover: {
          DEFAULT: "hsl(224 71% 4%)",
          foreground: "hsl(210 20% 98%)",
        },
        card: {
          DEFAULT: "hsl(224 71% 4%)",
          foreground: "hsl(210 20% 98%)",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.425rem",
        sm: "0.225rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
