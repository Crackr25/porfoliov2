"use client";

import dynamic from "next/dynamic";
import { useGame } from "@/context/GameContext";
import { useTheme } from "@/context/ThemeContext";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneMount() {
    const { isGameActive } = useGame();
    const { theme } = useTheme();
    // Unmount the 3D world while the game runs so the game's own canvas
    // gets the full frame budget.
    if (isGameActive) return null;
    return <Scene cute={theme === "cute"} />;
}
