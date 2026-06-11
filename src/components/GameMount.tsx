"use client";

import { useTheme } from "@/context/ThemeContext";
import FlappyBackground from "@/components/FlappyBackground";
import CatGame from "@/components/CatGame";

export default function GameMount() {
    const { theme } = useTheme();
    return theme === "cute" ? <CatGame /> : <FlappyBackground />;
}
