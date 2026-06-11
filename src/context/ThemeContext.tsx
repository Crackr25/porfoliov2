"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "cute";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const saved = localStorage.getItem("portfolio-theme");
        if (saved === "cute" || saved === "dark") setTheme(saved);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("cute", theme === "cute");
        localStorage.setItem("portfolio-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "cute" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
