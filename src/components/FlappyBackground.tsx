"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import { X, TriangleAlert } from "lucide-react";

export default function FlappyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isGameActive, endGame } = useGame();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    // Narrative Steps Configuration
    const narrativeSteps = [
        { score: 1, text: "Hi, I'm Izakahr Echem" },
        { score: 3, text: "Full Stack Laravel Developer" },
        { score: 6, text: "Specializing in PHP & React" },
        { score: 9, text: "Building Secure Systems" },
        { score: 12, text: "Let's Build Something Great!" },
    ];

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem("missileHighScore");
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Load Images
        const robotImage = new Image();
        robotImage.src = "/robot.png";

        const missileImage = new Image();
        missileImage.src = "/missile.png";

        let animationFrameId: number;
        let frames = 0;
        let mouseX = 0;
        let mouseY = 0;

        // Game constants
        const gravity = 0.25;
        const jumpStrength = -4.5;
        const activeSpeed = 5;
        const idleSpeed = 1;
        const missileSpawnRate = 100;

        // Giant Missile State
        let warningActive = false;
        let warningTimer = 0;
        let giantMissilePending = false;
        const warningDuration = 120; // 2 seconds at 60fps

        // Starfield
        const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
        const numStars = 100;

        const initStars = () => {
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random(),
                    speed: Math.random() * 0.5 + 0.1
                });
            }
        };

        const drawStars = () => {
            ctx.fillStyle = "white";
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Twinkle effect
                if (Math.random() > 0.95) {
                    star.opacity = Math.random();
                }

                // Move stars slightly for parallax feel
                star.x -= star.speed * (isGameActive ? 2 : 0.5);
                if (star.x < 0) {
                    star.x = canvas.width;
                    star.y = Math.random() * canvas.height;
                }
            });
            ctx.globalAlpha = 1.0;
        };

        // Drone (Player)
        const drone = {
            x: 100,
            y: canvas.height / 2,
            w: 80,
            h: 80,
            velocity: 0,
            draw: () => {
                if (!ctx) return;

                ctx.save();

                if (robotImage.complete) {
                    ctx.drawImage(robotImage, drone.x, drone.y, drone.w, drone.h);
                } else {
                    ctx.fillStyle = "#06b6d4";
                    ctx.fillRect(drone.x, drone.y, drone.w, drone.h);
                }

                // Draw Eyes (Procedural)
                const eyeOffsetX = 50;
                const eyeOffsetY = 25;
                const eyeX = drone.x + eyeOffsetX;
                const eyeY = drone.y + eyeOffsetY;
                const eyeRadius = 6;
                const pupilRadius = 2.5;

                // Calculate angle to mouse
                const dx = mouseX - eyeX;
                const dy = mouseY - eyeY;
                const angle = Math.atan2(dy, dx);

                // Limit pupil movement
                const maxPupilDist = 2;
                const pupilX = eyeX + Math.cos(angle) * maxPupilDist;
                const pupilY = eyeY + Math.sin(angle) * maxPupilDist;

                // Draw Sclera (White part)
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();

                // Draw Pupil (Cyan part)
                ctx.fillStyle = "#06b6d4";
                ctx.beginPath();
                ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
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

        // Missiles
        const missiles: { x: number; y: number; w: number; h: number; passed: boolean; isGiant: boolean }[] = [];

        // Floating Narrative Text
        const floatingTexts: { x: number; y: number; text: string; alpha: number }[] = [];
        const spawnedNarratives = new Set<number>();

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
                localStorage.setItem("missileHighScore", score.toString());
            }
        };

        const resetGame = () => {
            drone.y = canvas.height / 2;
            drone.velocity = 0;
            missiles.length = 0;
            floatingTexts.length = 0;
            spawnedNarratives.clear();
            frames = 0;
            warningActive = false;
            warningTimer = 0;
            giantMissilePending = false;
            setShowWarning(false);
            setScore(0);
            setGameOver(false);
        };

        const spawnMissile = (isGiant = false) => {
            let w = 60;
            let h = 30;
            let y = Math.random() * (canvas.height - h);

            if (isGiant) {
                w = 180;
                h = 90;
                y = Math.random() * (canvas.height - h);
            }

            missiles.push({
                x: canvas.width,
                y,
                w,
                h,
                passed: false,
                isGiant
            });
        };

        const spawnFloatingText = (text: string) => {
            floatingTexts.push({
                x: canvas.width,
                y: canvas.height / 3, // Spawn in upper third
                text,
                alpha: 1.0
            });
        };

        const handleGiantMissileLogic = () => {
            if (!isGameActive) return;

            // Trigger warning every 15 points or randomly (here we do random for demo feel)
            // Let's make it more predictable for testing: every 10 points
            if (score > 0 && score % 10 === 0 && !warningActive && !giantMissilePending && !spawnedNarratives.has(score + 1000)) { // +1000 hack to prevent multi-trigger
                warningActive = true;
                warningTimer = warningDuration;
                setShowWarning(true);
                spawnedNarratives.add(score + 1000); // Mark this milestone as triggered
            }

            if (warningActive) {
                warningTimer--;
                if (warningTimer <= 0) {
                    warningActive = false;
                    setShowWarning(false);
                    giantMissilePending = true;
                }
            } else if (giantMissilePending) {
                spawnMissile(true);
                giantMissilePending = false;
            }
        };

        const drawMissiles = () => {
            const currentSpeed = isGameActive ? activeSpeed : idleSpeed;

            // Normal Spawn logic (disable if warning is active to clear screen for boss)
            if (isGameActive && !warningActive && !giantMissilePending && frames % missileSpawnRate === 0) {
                spawnMissile(false);
            }

            for (let i = 0; i < missiles.length; i++) {
                const m = missiles[i];
                // Giant missiles move slightly slower
                m.x -= m.isGiant ? currentSpeed * 0.8 : currentSpeed;

                if (missileImage.complete) {
                    ctx.drawImage(missileImage, m.x, m.y, m.w, m.h);
                } else {
                    ctx.fillStyle = "#ef4444";
                    ctx.fillRect(m.x, m.y, m.w, m.h);
                }

                if (isGameActive) {
                    const hitX = drone.x + 15;
                    const hitY = drone.y + 15;
                    const hitW = drone.w - 30;
                    const hitH = drone.h - 30;

                    const mHitX = m.x + 5;
                    const mHitY = m.y + 5;
                    const mHitW = m.w - 10;
                    const mHitH = m.h - 10;

                    if (
                        hitX < mHitX + mHitW &&
                        hitX + hitW > mHitX &&
                        hitY < mHitY + mHitH &&
                        hitY + hitH > mHitY
                    ) {
                        setGameOver(true);
                        checkHighScore();
                    }

                    if (m.x + m.w < drone.x && !m.passed) {
                        setScore((prev) => prev + 1); // Giant missile gives 1 point too for now
                        m.passed = true;
                    }
                }

                if (m.x + m.w < -200) {
                    missiles.shift();
                    i--;
                }
            }
        };

        const drawFloatingText = () => {
            // Check if we need to spawn narrative
            if (isGameActive) {
                const step = narrativeSteps.find(s => s.score === score);
                if (step && !spawnedNarratives.has(score)) {
                    spawnFloatingText(step.text);
                    spawnedNarratives.add(score);
                }
            }

            for (let i = 0; i < floatingTexts.length; i++) {
                const ft = floatingTexts[i];
                ft.x -= 2; // Move slower than missiles

                ctx.save();
                ctx.globalAlpha = ft.alpha;
                ctx.fillStyle = "white";
                ctx.font = "bold 32px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.shadowColor = "#06b6d4";
                ctx.shadowBlur = 10;
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();

                if (ft.x < -500) {
                    floatingTexts.shift();
                    i--;
                }
            }
        };

        const animate = () => {
            // Clear with dark space background
            ctx.fillStyle = "#050510"; // Dark space blue/black
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawStars();

            handleGiantMissileLogic();

            drawFloatingText();
            drawMissiles();
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

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("keydown", handleInput);
        window.addEventListener("click", handleInput);
        window.addEventListener("touchstart", handleInput);
        window.addEventListener("mousemove", handleMouseMove);

        resizeCanvas();
        initStars();

        if (isGameActive) {
            resetGame();
        }

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("keydown", handleInput);
            window.removeEventListener("click", handleInput);
            window.removeEventListener("touchstart", handleInput);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isGameActive, gameOver, highScore]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`fixed top-0 left-0 w-full h-full -z-10 bg-[#050510] transition-opacity duration-1000 ${isGameActive ? 'cursor-pointer' : ''}`}
            />

            {isGameActive && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Warning Indicator */}
                    {showWarning && (
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col items-center animate-pulse">
                            <TriangleAlert className="w-24 h-24 text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                            <div className="text-4xl font-bold text-red-500 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                WARNING
                            </div>
                        </div>
                    )}

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
