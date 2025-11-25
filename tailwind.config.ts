import type { Config } from "tailwindcss";

const config: Config = {
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
                primary: "var(--primary)",
                "primary-glow": "var(--primary-glow)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                "accent-glow": "var(--accent-glow)",
                "card-bg": "var(--card-bg)",
                "card-border": "var(--card-border)",
                "nav-bg": "var(--nav-bg)",
            },
            fontFamily: {
                sans: ["var(--font-body)"],
                mono: ["var(--font-mono)"],
                display: ["var(--font-display)"],
            },
        },
    },
    plugins: [],
};
export default config;
