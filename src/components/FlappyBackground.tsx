"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlappyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isGameActive, endGame } = useGame();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Narrative Steps Configuration
    const narrativeSteps = [
        { score: 0, text: "Hi, I'm Izakahr Echem" },
        { score: 2, text: "Full Stack Laravel Developer" },
        { score: 5, text: "Specializing in PHP & React" },
        { score: 8, text: "Building Secure Systems" },
        { score: 12, text: "Let's Build Something Great!" },
    ];

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem("flappyHighScore");
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let frames = 0;

        // Game constants
        const gravity = 0.25;
        const jumpStrength = -4.5;
        const activeSpeed = 3;
        const idleSpeed = 1;
        const pipeGap = 170;
        const pipeWidth = 60;
        const pipeSpacing = 250;

        // Drone (Player)
        const drone = {
            x: 100,
            y: canvas.height / 2,
            w: 30,
            h: 30,
            velocity: 0,
            draw: () => {
                if (!ctx) return;
                ctx.fillStyle = "#06b6d4"; // Cyan
                ctx.shadowBlur = isGameActive ? 15 : 5;
                ctx.shadowColor = "#06b6d4";
                ctx.fillRect(drone.x, drone.y, drone.w, drone.h);
                ctx.shadowBlur = 0;

                // Drone eye
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(drone.x + 20, drone.y + 5, 5, 5);
            },
            update: () => {
                if (isGameActive) {
                    drone.velocity += gravity;
                    drone.y += drone.velocity;

                    // Floor collision
                    if (drone.y + drone.h >= canvas.height) {
                        drone.y = canvas.height - drone.h;
                        setGameOver(true);
                        checkHighScore();
                    }

                    // Ceiling collision
                    if (drone.y < 0) {
                        drone.y = 0;
                        drone.velocity = 0;
                    }
                } else {
                    // Idle animation (Sine wave)
                    drone.y = canvas.height / 2 + Math.sin(frames * 0.05) * 50;
                    drone.velocity = 0;
                }
            },
            jump: () => {
                if (isGameActive) {
                    drone.velocity = jumpStrength;
                }
            },
        };

        // Obstacles
        const pipes: { x: number; topHeight: number; passed: boolean; text?: string }[] = [];
        let pipesSpawned = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (!isGameActive) {
                drone.y = canvas.height / 2;
            }
        };

        const checkHighScore = () => {
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("flappyHighScore", score.toString());
            }
        };

        const resetGame = () => {
            drone.y = canvas.height / 2;
            drone.velocity = 0;
            pipes.length = 0;
            frames = 0;
            pipesSpawned = 0;
            setScore(0);
            setGameOver(false);

            // Spawn first pipe
            spawnPipe(true);
        };

        const spawnPipe = (isFirst = false) => {
            const minHeight = 50;
            const maxHeight = canvas.height - pipeGap - minHeight;
            const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

            // Calculate start X
            let startX = canvas.width;
            if (isFirst) {
                startX = Math.max(canvas.width * 0.6, 400);
            }

            // Get narrative text for this pipe index
            const narrative = narrativeSteps.find(s => s.score === pipesSpawned);

            pipes.push({
                x: startX,
                topHeight,
                passed: false,
                text: narrative?.text
            });

            pipesSpawned++;
        };

        const drawPipes = () => {
            const currentSpeed = isGameActive ? activeSpeed : idleSpeed;
            const currentSpacing = isGameActive ? pipeSpacing : pipeSpacing * 1.5;

            // Only spawn new pipes if we've moved enough frames
            if (frames > 0 && frames % currentSpacing === 0) {
                spawnPipe();
            }

            for (let i = 0; i < pipes.length; i++) {
                const p = pipes[i];
                p.x -= currentSpeed;

                // Draw Top Pipe
                ctx.fillStyle = isGameActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.2)"; // Violet
                ctx.shadowBlur = isGameActive ? 5 : 0;
                ctx.shadowColor = "#8b5cf6";
                ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);

                // Draw Bottom Pipe
                ctx.fillRect(p.x, p.topHeight + pipeGap, pipeWidth, canvas.height - p.topHeight - pipeGap);
                ctx.shadowBlur = 0;

                // Draw Narrative Text in Gap
                if (p.text && isGameActive) {
                    ctx.save();
                    ctx.fillStyle = "white";
                    ctx.font = "bold 24px Inter, sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;

                    // Split text into multiple lines if too long
                    const words = p.text.split(' ');
                    let line = '';
                    const lines = [];
                    const maxWidth = 300; // Max width for text

                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + ' ';
                        const metrics = ctx.measureText(testLine);
                        const testWidth = metrics.width;
                        if (testWidth > maxWidth && n > 0) {
                            lines.push(line);
                            line = words[n] + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    lines.push(line);

                    // Draw lines centered in gap
                    const lineHeight = 30;
                    const totalHeight = lines.length * lineHeight;
                    const startY = p.topHeight + (pipeGap / 2) - (totalHeight / 2) + (lineHeight / 2);

                    lines.forEach((l, index) => {
                        ctx.fillText(l, p.x + pipeWidth / 2, startY + (index * lineHeight));
                    });

                    ctx.restore();
                }

                // Collision Detection (Only when active)
                if (isGameActive) {
                    if (
                        drone.x < p.x + pipeWidth &&
                        drone.x + drone.w > p.x &&
                        (drone.y < p.topHeight || drone.y + drone.h > p.topHeight + pipeGap)
                    ) {
                        setGameOver(true);
                        checkHighScore();
                    }

                    // Score Update
                    if (p.x + pipeWidth < drone.x && !p.passed) {
                        setScore((prev) => prev + 1);
                        p.passed = true;
                    }
                }

                // Remove off-screen pipes
                if (p.x + pipeWidth < -300) { // Increased buffer for text visibility
                    pipes.shift();
                    i--;
                }
            }
        };

        const drawGrid = () => {
            if (isGameActive) return; // Hide grid in game mode for cleaner look

            ctx.strokeStyle = "rgba(139, 92, 246, 0.05)";
            ctx.lineWidth = 1;
            const gridSize = 50;

            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGrid();
            drawPipes();
            drone.update();
            drone.draw();

            frames++;
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleInput = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
            if (!isGameActive) return;

            if ((e as KeyboardEvent).code === "Space" || e.type === "click" || e.type === "touchstart") {
                if (gameOver) {
                    resetGame();
                } else {
                    drone.jump();
                }
            }
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("keydown", handleInput);
        window.addEventListener("click", handleInput);
        window.addEventListener("touchstart", handleInput);

        resizeCanvas();

        // Force reset if starting game
        if (isGameActive) {
            resetGame();
        }

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("keydown", handleInput);
            window.removeEventListener("click", handleInput);
            window.removeEventListener("touchstart", handleInput);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isGameActive, gameOver, highScore]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`fixed top-0 left-0 w-full h-full -z-10 bg-[#050505] transition-opacity duration-1000 ${isGameActive ? 'cursor-pointer' : ''}`}
            />

            {isGameActive && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Score Display */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
                        <div className="text-6xl font-bold text-white font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                            {score}
                        </div>
                        <div className="text-sm font-mono text-primary/80 mt-2">
                            HIGH SCORE: {highScore}
                        </div>
                    </div>

                    <button
                        onClick={endGame}
                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
                    >
                        <X className="w-8 h-8 text-white" />
                    </button>

                    {gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
                            <div className="text-center bg-black/90 p-8 border border-red-500 rounded-sm">
                                <h2 className="text-5xl font-bold text-red-500 mb-2 glitch-text" data-text="MISSION FAILED">
                                    MISSION FAILED
                                </h2>
                                <div className="flex justify-center gap-8 mb-6">
                                    <div>
                                        <p className="text-gray-400 text-sm">SCORE</p>
                                        <p className="text-3xl text-white font-mono">{score}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">BEST</p>
                                        <p className="text-3xl text-accent font-mono">{highScore}</p>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-400 animate-pulse mb-6">PRESS SPACE OR CLICK TO RETRY</p>
                                <button
                                    onClick={endGame}
                                    className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors font-mono"
                                >
                                    ABORT MISSION
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
