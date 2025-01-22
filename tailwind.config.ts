import type { Config } from "tailwindcss";

export default {
  safelist: ['hover:opacity-70', 'transition-opacity', 'duration-300'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'body-border': 'rgb(186, 197, 237)',
        'lightblue-bg':'#dee3f6',
      },
    },
  },
  plugins: [],
} satisfies Config;
