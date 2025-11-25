"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FlappyDroneProps {
    onClose: () => void;
}

export default function FlappyDrone({ onClose }: FlappyDroneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Game variables
        let animationFrameId: number;
        let frames = 0;
        const gravity = 0.25;
        const jumpStrength = -4.5;
        const speed = 2;
        const pipeGap = 150;
        const pipeWidth = 50;
        const pipeSpacing = 200;

        // Drone (Player)
        const drone = {
            x: 50,
            y: 150,
            w: 30,
            h: 30,
            velocity: 0,
            draw: () => {
                if (!ctx) return;
                ctx.fillStyle = "#06b6d4"; // Cyan
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#06b6d4";
                ctx.fillRect(drone.x, drone.y, drone.w, drone.h);
                ctx.shadowBlur = 0;

                // Drone eye
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(drone.x + 20, drone.y + 5, 5, 5);
            },
            update: () => {
                drone.velocity += gravity;
                drone.y += drone.velocity;

                // Floor collision
                if (drone.y + drone.h >= canvas.height) {
                    drone.y = canvas.height - drone.h;
                    setGameOver(true);
                }

                // Ceiling collision
                if (drone.y < 0) {
                    drone.y = 0;
                    drone.velocity = 0;
                }
            },
            jump: () => {
                drone.velocity = jumpStrength;
            },
        };

        // Obstacles (Firewalls)
        const pipes: { x: number; topHeight: number; passed: boolean }[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const resetGame = () => {
            drone.y = 150;
            drone.velocity = 0;
            pipes.length = 0;
            frames = 0;
            setScore(0);
            setGameOver(false);
            setGameStarted(true);
        };

        const drawPipes = () => {
            if (frames % pipeSpacing === 0) {
                const minHeight = 50;
                const maxHeight = canvas.height - pipeGap - minHeight;
                const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                pipes.push({ x: canvas.width, topHeight, passed: false });
            }

            for (let i = 0; i < pipes.length; i++) {
                const p = pipes[i];
                p.x -= speed;

                // Draw Top Pipe
                ctx.fillStyle = "#8b5cf6"; // Violet
                ctx.shadowBlur = 5;
                ctx.shadowColor = "#8b5cf6";
                ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);

                // Draw Bottom Pipe
                ctx.fillRect(p.x, p.topHeight + pipeGap, pipeWidth, canvas.height - p.topHeight - pipeGap);
                ctx.shadowBlur = 0;

                // Collision Detection
                if (
                    drone.x < p.x + pipeWidth &&
                    drone.x + drone.w > p.x &&
                    (drone.y < p.topHeight || drone.y + drone.h > p.topHeight + pipeGap)
                ) {
                    setGameOver(true);
                }

                // Score Update
                if (p.x + pipeWidth < drone.x && !p.passed) {
                    setScore((prev) => prev + 1);
                    p.passed = true;
                }

                // Remove off-screen pipes
                if (p.x + pipeWidth < 0) {
                    pipes.shift();
                    i--;
                }
            }
        };

        const animate = () => {
            if (!gameStarted) {
                // Draw "Press Start" screen
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return;
            }

            if (gameOver) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawPipes();
            drone.update();
            drone.draw();

            frames++;
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleInput = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
            if ((e as KeyboardEvent).code === "Space" || e.type === "click" || e.type === "touchstart") {
                if (!gameStarted) {
                    setGameStarted(true);
                } else if (gameOver) {
                    resetGame();
                } else {
                    drone.jump();
                }
            }
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("keydown", handleInput);
        canvas.addEventListener("click", handleInput);
        canvas.addEventListener("touchstart", handleInput);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("keydown", handleInput);
            canvas.removeEventListener("click", handleInput);
            canvas.removeEventListener("touchstart", handleInput);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStarted, gameOver]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer" />

            {/* UI Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <div className="text-6xl font-bold text-white font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                    {score}
                </div>
            </div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[101]"
            >
                <X className="w-8 h-8 text-white" />
            </button>

            {!gameStarted && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-4 glitch-text" data-text="TRAINING SIMULATION">
                            TRAINING SIMULATION
                        </h2>
                        <p className="text-xl text-accent animate-pulse">PRESS SPACE OR CLICK TO START</p>
                    </div>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-black/90 p-8 border border-red-500 rounded-sm">
                        <h2 className="text-5xl font-bold text-red-500 mb-2 glitch-text" data-text="MISSION FAILED">
                            MISSION FAILED
                        </h2>
                        <p className="text-2xl text-white mb-6">SCORE: {score}</p>
                        <p className="text-lg text-gray-400 animate-pulse">PRESS SPACE OR CLICK TO RETRY</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
