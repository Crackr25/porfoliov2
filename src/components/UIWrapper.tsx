"use client";

import { useGame } from "@/context/GameContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export default function UIWrapper({ children }: { children: React.ReactNode }) {
    const { isGameActive } = useGame();

    return (
        <div className={`relative z-10 transition-opacity duration-500 ${isGameActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
