/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Blue 600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#475569", // Slate 600
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444", // Red 500
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // Slate 100
          foreground: "#64748b", // Slate 500
        },
        accent: {
          DEFAULT: "#e2e8f0", // Slate 200
          foreground: "#0f172a", // Slate 900
        },
        background: "#ffffff",
        foreground: "#0f172a", // Slate 900
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a", // Slate 900
        },
        border: "#e2e8f0", // Slate 200
        input: "#e2e8f0", // Slate 200
        ring: "#2563eb", // Blue 600
      },
    },
  },
  plugins: [],
}; 