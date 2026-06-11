"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const EMOJIS = ["🐱", "🐟", "🧶", "💖", "🌸", "✨", "🐾", "😺", "💕", "🎀"];
const MESSAGES = [
    "meow!! you found me! 😺",
    "did you know? cats sleep 16 hours a day 💤",
    "you've been booped 🐾",
    "purrfect choice! 💖",
    "a cat's nose print is unique, like a fingerprint! 🐱",
    "+10 happiness! ✨",
    "cats can make over 100 different sounds! 🎵",
    "thanks for visiting! here's confetti 🎉",
];

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vr: number;
    size: number;
    emoji: string;
    life: number;
};

export default function Surprise() {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const rafId = useRef<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const msgTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            if (msgTimeout.current) clearTimeout(msgTimeout.current);
        };
    }, []);

    if (theme !== "cute") return null;

    const tick = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach((p) => {
            p.vy += 0.18;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.life--;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = Math.min(1, p.life / 30);
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.emoji, 0, 0);
            ctx.restore();
        });
        particles.current = particles.current.filter(
            (p) => p.life > 0 && p.y < canvas.height + 60
        );

        if (particles.current.length > 0) {
            rafId.current = requestAnimationFrame(tick);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rafId.current = null;
        }
    };

    const burst = (e: React.MouseEvent<HTMLButtonElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ox = e.clientX;
        const oy = e.clientY;
        for (let i = 0; i < 70; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 9;
            particles.current.push({
                x: ox,
                y: oy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.3,
                size: 18 + Math.random() * 22,
                emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                life: 80 + Math.random() * 60,
            });
        }

        setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        if (msgTimeout.current) clearTimeout(msgTimeout.current);
        msgTimeout.current = setTimeout(() => setMessage(null), 2600);

        if (!rafId.current) rafId.current = requestAnimationFrame(tick);
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-[80] pointer-events-none"
                aria-hidden
            />

            {message && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[85] bg-white border-2 border-pink-300 text-pink-600 font-bold px-6 py-3 rounded-full shadow-[0_8px_24px_rgba(244,114,182,0.35)] animate-bounce pointer-events-none text-center">
                    {message}
                </div>
            )}

            <button
                onClick={burst}
                aria-label="Click me for a surprise!"
                className="fixed bottom-6 right-6 z-[85] group flex items-center gap-2 pl-4 pr-5 py-3 bg-gradient-to-r from-pink-400 to-violet-400 text-white font-bold text-sm rounded-full shadow-[0_8px_24px_rgba(244,114,182,0.45)] hover:scale-110 active:scale-95 transition-transform"
            >
                <span className="text-xl animate-[wiggle_1.2s_ease-in-out_infinite] inline-block">🎁</span>
                click me!
            </button>
        </>
    );
}
