"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Cat, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const navItems = {
    dark: [
        { name: "BASE", href: "#hero" },
        { name: "STATS", href: "#about" },
        { name: "MISSIONS", href: "#projects" },
        { name: "COMMS", href: "#contact" },
    ],
    cute: [
        { name: "home", href: "#hero" },
        { name: "about me", href: "#about" },
        { name: "projects", href: "#projects" },
        { name: "say hi!", href: "#contact" },
    ],
};

export default function Navbar() {
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();
    const cute = theme === "cute";
    const items = cute ? navItems.cute : navItems.dark;

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-nav-bg border-b border-white/10 cute:border-pink-200"
        >
            {cute ? (
                <div className="text-xl font-bold tracking-wide text-pink-500">
                    izakahr <span className="text-base">🐾</span>
                </div>
            ) : (
                <div className="text-xl font-bold tracking-widest text-primary glitch-text" data-text="PLAYER 1">
                    PLAYER 1
                </div>
            )}

            <ul className="flex gap-8 items-center">
                {items.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className="relative text-sm font-medium tracking-wider text-gray-400 hover:text-white transition-colors cute:text-pink-400 cute:hover:text-pink-600"
                            onMouseEnter={() => setActiveHover(item.name)}
                            onMouseLeave={() => setActiveHover(null)}
                        >
                            {activeHover === item.name && (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-sm cute:rounded-full cute:bg-pink-400"
                                />
                            )}
                            {cute ? item.name : `[${item.name}]`}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    aria-label={cute ? "Switch to dark mode" : "Switch to cute cat mode"}
                    title={cute ? "Back to the dark side" : "Cat mode 🐱"}
                    className={`p-2 rounded-full border transition-all duration-300 hover:scale-110 ${
                        cute
                            ? "bg-white border-pink-300 text-violet-500 shadow-[0_4px_12px_rgba(244,114,182,0.3)]"
                            : "bg-white/5 border-white/15 text-pink-400 hover:border-pink-400/60"
                    }`}
                >
                    {cute ? <Moon className="w-4 h-4" /> : <Cat className="w-4 h-4" />}
                </button>
                <div className="hidden md:block text-xs text-gray-500 font-mono cute:text-pink-300">
                    {cute ? "purring at 60fps ฅ^•ﻌ•^ฅ" : "SYS.ONLINE // v1.0.0"}
                </div>
            </div>
        </motion.nav>
    );
}
