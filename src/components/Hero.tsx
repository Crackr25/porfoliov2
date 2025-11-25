"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useRef } from "react";

export default function Hero() {
    const { startGame } = useGame();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} id="hero" className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="z-10 text-center space-y-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1 border border-primary/30 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4"
                >
                    SYSTEM INITIALIZED
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-2 glitch-text"
                    data-text="IZAKAHR ECHEM"
                >
                    IZAKAHR ECHEM
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-mono"
                >
                    Web Developer | PHP, Laravel, JavaScript
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-8"
                >
                    <button
                        onClick={startGame}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary/10 border border-primary hover:bg-primary/20 transition-all duration-300 rounded-sm overflow-hidden"
                    >
                        <span className="relative z-10 font-bold tracking-widest text-primary group-hover:text-white transition-colors">
                            START GAME
                        </span>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors relative z-10" />

                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono"
            >
                SCROLL TO CONTINUE
            </motion.div>
        </section>
    );
}
