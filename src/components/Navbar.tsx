"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
    { name: "BASE", href: "#hero" },
    { name: "STATS", href: "#about" },
    { name: "MISSIONS", href: "#projects" },
    { name: "COMMS", href: "#contact" },
];

export default function Navbar() {
    const [activeHover, setActiveHover] = useState<string | null>(null);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-nav-bg backdrop-blur-md border-b border-white/10"
        >
            <div className="text-xl font-bold tracking-widest text-primary glitch-text" data-text="PLAYER 1">
                PLAYER 1
            </div>

            <ul className="flex gap-8">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className="relative text-sm font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
                            onMouseEnter={() => setActiveHover(item.name)}
                            onMouseLeave={() => setActiveHover(null)}
                        >
                            {activeHover === item.name && (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-sm"
                                />
                            )}
                            [{item.name}]
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="hidden md:block text-xs text-gray-500 font-mono">
                SYS.ONLINE // v1.0.0
            </div>
        </motion.nav>
    );
}
