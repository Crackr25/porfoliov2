"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import { X } from "lucide-react";

/* Cute-mode mini game: flap the kitty, catch fish, dodge cucumbers. */
export default function CatGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isGameActive, endGame } = useGame();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [deathCause, setDeathCause] = useState<"cucumber" | "fell">("fell");

    const highScoreRef = useRef(0);

    const narrativeSteps = [
        { score: 3, text: "hi! i'm izakahr's cat 🐱" },
        { score: 6, text: "he builds websites with Laravel & React" },
        { score: 10, text: "he feeds me very well (i'm a server cat)" },
        { score: 15, text: "hire him so i get more treats! 🐟" },
    ];

    useEffect(() => {
        const saved = localStorage.getItem("catGameHighScore");
        if (saved) {
            const parsed = parseInt(saved);
            setHighScore(parsed);
            highScoreRef.current = parsed;
        }
    }, []);

    useEffect(() => {
        highScoreRef.current = highScore;
    }, [highScore]);

    useEffect(() => {
        if (!isGameActive) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let frames = 0;
        let currentScore = 0;
        let isOver = false;

        const gravity = 0.22;
        const jumpStrength = -5;
        const scrollSpeed = 3.2;

        const cat = { x: 0, y: 0, vy: 0, size: 52 };

        type Item = { x: number; y: number; type: "fish" | "cucumber"; caught?: boolean; wobble: number };
        let items: Item[] = [];

        type Cloud = { x: number; y: number; scale: number; speed: number };
        const clouds: Cloud[] = [];

        type PawPrint = { x: number; y: number };
        const ground: PawPrint[] = [];

        type Pop = { x: number; y: number; t: number; text: string };
        let pops: Pop[] = [];

        let narrative: { text: string; timer: number } | null = null;
        const shownSteps = new Set<number>();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cat.x = canvas.width * 0.22;
        };
        resize();
        cat.y = canvas.height / 2;
        window.addEventListener("resize", resize);

        for (let i = 0; i < 7; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.6,
                scale: 0.6 + Math.random() * 1.2,
                speed: 0.3 + Math.random() * 0.5,
            });
        }
        for (let i = 0; i < 14; i++) {
            ground.push({ x: i * 120, y: canvas.height - 30 - Math.random() * 20 });
        }

        const reset = () => {
            cat.y = canvas.height / 2;
            cat.vy = 0;
            items = [];
            pops = [];
            currentScore = 0;
            isOver = false;
            frames = 0;
            shownSteps.clear();
            setScore(0);
            setGameOver(false);
        };

        const flap = () => {
            if (isOver) {
                reset();
                return;
            }
            cat.vy = jumpStrength;
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                flap();
            }
        };
        const onClick = () => flap();
        window.addEventListener("keydown", onKey);
        canvas.addEventListener("mousedown", onClick);
        canvas.addEventListener("touchstart", onClick);

        const die = (cause: "cucumber" | "fell" = "fell") => {
            setDeathCause(cause);
            isOver = true;
            setGameOver(true);
            if (currentScore > highScoreRef.current) {
                highScoreRef.current = currentScore;
                setHighScore(currentScore);
                localStorage.setItem("catGameHighScore", String(currentScore));
            }
        };

        const drawEmoji = (emoji: string, x: number, y: number, size: number, rotation = 0) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.font = `${size}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(emoji, 0, 0);
            ctx.restore();
        };

        const loop = () => {
            frames++;

            // pastel sky
            const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
            sky.addColorStop(0, "#ffeef8");
            sky.addColorStop(0.6, "#fff7fb");
            sky.addColorStop(1, "#fde7f3");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // sun
            drawEmoji("🌸", canvas.width - 90, 90, 56, frames * 0.002);

            // clouds
            clouds.forEach((c) => {
                c.x -= c.speed;
                if (c.x < -120) {
                    c.x = canvas.width + 120;
                    c.y = Math.random() * canvas.height * 0.6;
                }
                drawEmoji("☁️", c.x, c.y, 60 * c.scale);
            });

            // paw-print ground trail
            ctx.globalAlpha = 0.35;
            ground.forEach((g) => {
                g.x -= scrollSpeed * 0.6;
                if (g.x < -40) g.x = canvas.width + 40;
                drawEmoji("🐾", g.x, g.y, 22);
            });
            ctx.globalAlpha = 1;

            if (!isOver) {
                // physics
                cat.vy += gravity;
                cat.y += cat.vy;

                // bounds
                if (cat.y > canvas.height - 40 || cat.y < 20) die();

                // spawn items: mostly fish, sometimes cucumbers
                if (frames % 55 === 0) {
                    const isCuke = Math.random() < 0.42;
                    items.push({
                        x: canvas.width + 60,
                        y: 60 + Math.random() * (canvas.height - 160),
                        type: isCuke ? "cucumber" : "fish",
                        wobble: Math.random() * Math.PI * 2,
                    });
                }
            }

            // items
            items.forEach((it) => {
                if (!isOver) {
                    it.x -= scrollSpeed + currentScore * 0.06;
                    it.y += Math.sin(frames * 0.05 + it.wobble) * 0.8;
                }
                drawEmoji(
                    it.type === "fish" ? "🐟" : "🥒",
                    it.x,
                    it.y,
                    it.type === "fish" ? 36 : 44,
                    it.type === "cucumber" ? Math.sin(frames * 0.1 + it.wobble) * 0.4 : 0
                );

                if (!isOver && !it.caught) {
                    const dx = it.x - cat.x;
                    const dy = it.y - cat.y;
                    const dist = Math.hypot(dx, dy);
                    if (it.type === "fish" && dist < 42) {
                        it.caught = true;
                        currentScore++;
                        setScore(currentScore);
                        pops.push({ x: it.x, y: it.y, t: 0, text: ["nom!", "yum!", "+1 🐟", "purr~"][currentScore % 4] });

                        const step = narrativeSteps.find((s) => s.score === currentScore);
                        if (step && !shownSteps.has(step.score)) {
                            shownSteps.add(step.score);
                            narrative = { text: step.text, timer: 180 };
                        }
                    } else if (it.type === "cucumber" && dist < 38) {
                        die("cucumber");
                    }
                }
            });
            items = items.filter((it) => it.x > -80 && !it.caught);

            // score pops
            pops.forEach((p) => {
                p.t++;
                ctx.globalAlpha = Math.max(0, 1 - p.t / 40);
                ctx.fillStyle = "#ec4899";
                ctx.font = "bold 22px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(p.text, p.x, p.y - p.t * 1.2);
                ctx.globalAlpha = 1;
            });
            pops = pops.filter((p) => p.t < 40);

            // the kitty
            const tilt = Math.max(-0.4, Math.min(0.5, cat.vy * 0.06));
            drawEmoji(isOver ? "🙀" : "🐱", cat.x, cat.y, cat.size, tilt);

            // narrative bubble
            if (narrative && narrative.timer > 0) {
                narrative.timer--;
                const alpha = Math.min(1, narrative.timer / 30);
                ctx.globalAlpha = alpha;
                ctx.font = "bold 26px sans-serif";
                ctx.textAlign = "center";
                const w = ctx.measureText(narrative.text).width + 50;
                const bx = canvas.width / 2;
                const by = canvas.height * 0.22;
                ctx.fillStyle = "rgba(255,255,255,0.92)";
                ctx.strokeStyle = "#f9a8d4";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(bx - w / 2, by - 26, w, 52, 26);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#9d3a6d";
                ctx.fillText(narrative.text, bx, by + 9);
                ctx.globalAlpha = 1;
            }

            animationFrameId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", onKey);
            canvas.removeEventListener("mousedown", onClick);
            canvas.removeEventListener("touchstart", onClick);
        };
    }, [isGameActive]);

    if (!isGameActive) return null;

    return (
        <>
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[90] cursor-pointer" />

            <div className="fixed inset-0 z-[100] pointer-events-none">
                {/* score HUD */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-6xl font-bold text-pink-500 font-mono drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]">
                        {score}
                    </div>
                    <div className="text-sm font-mono text-pink-400 mt-2">
                        best: {highScore} 🐟
                    </div>
                </div>

                {/* instructions */}
                {score === 0 && !gameOver && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-pink-400 font-mono text-sm bg-white/80 px-6 py-3 rounded-full border-2 border-pink-200">
                        tap or press space to flap — catch 🐟, avoid 🥒!
                    </div>
                )}

                {/* close */}
                <button
                    onClick={endGame}
                    className="absolute top-6 right-6 p-2 bg-white border-2 border-pink-200 rounded-full hover:bg-pink-50 hover:border-pink-400 transition-colors pointer-events-auto shadow-[0_4px_12px_rgba(244,114,182,0.25)]"
                >
                    <X className="w-8 h-8 text-pink-400" />
                </button>

                {/* game over */}
                {gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-pink-100/40 backdrop-blur-sm pointer-events-auto">
                        <div className="text-center bg-white p-10 border-2 border-pink-300 rounded-3xl shadow-[0_20px_60px_rgba(244,114,182,0.35)]">
                            <div className="text-5xl mb-3">😿</div>
                            <h2 className="text-4xl font-bold text-pink-500 mb-2">
                                {deathCause === "cucumber" ? "the cucumber got you!" : "cats always land on their feet... usually"}
                            </h2>
                            <div className="flex justify-center gap-10 my-6">
                                <div>
                                    <p className="text-pink-300 text-sm font-mono">fish caught</p>
                                    <p className="text-3xl text-purple-600 font-mono font-bold">{score}</p>
                                </div>
                                <div>
                                    <p className="text-pink-300 text-sm font-mono">best</p>
                                    <p className="text-3xl text-sky-500 font-mono font-bold">{highScore}</p>
                                </div>
                            </div>
                            <p className="text-purple-400 font-mono text-sm mb-6">
                                press space or tap to try again
                            </p>
                            <button
                                onClick={endGame}
                                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-violet-400 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_6px_20px_rgba(244,114,182,0.4)]"
                            >
                                back to portfolio 🐾
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
