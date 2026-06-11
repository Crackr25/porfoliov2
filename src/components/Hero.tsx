"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useTheme } from "@/context/ThemeContext";
import { useRef } from "react";

const NAME = "IZAKAHR ECHEM";

const letterContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.3 } },
};

const letter: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: -90 },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { type: "spring", damping: 14, stiffness: 200 },
    },
};

export default function Hero() {
    const { startGame } = useGame();
    const { theme } = useTheme();
    const cute = theme === "cute";
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

    return (
        <section
            ref={ref}
            id="hero"
            className="h-screen flex flex-col justify-center items-center relative overflow-hidden"
        >
            <motion.div
                style={{ y: yText, opacity: opacityText, scale: scaleText }}
                className="z-10 text-center max-w-5xl mx-auto px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono tracking-[0.3em] text-accent mb-8"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {cute ? "ฅ^•ﻌ•^ฅ hello from Cagayan de Oro!" : "SYSTEM ONLINE — CAGAYAN DE ORO, PH"}
                </motion.div>

                <motion.h1
                    variants={letterContainer}
                    initial="hidden"
                    animate="show"
                    className="text-[clamp(2.8rem,9vw,7.5rem)] font-bold tracking-tighter leading-[0.95] mb-6 select-none"
                    style={{ perspective: 600 }}
                    aria-label={NAME}
                >
                    {NAME.split("").map((ch, i) => (
                        <motion.span
                            key={i}
                            variants={letter}
                            className={`inline-block ${ch === " " ? "w-[0.35em]" : ""} bg-gradient-to-b from-white via-white to-violet-300/60 cute:from-pink-400 cute:via-pink-500 cute:to-violet-500 bg-clip-text text-transparent hover:from-violet-400 hover:to-cyan-400 cute:hover:from-sky-400 cute:hover:to-pink-400 transition-colors duration-300`}
                        >
                            {ch === " " ? " " : ch}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-lg md:text-2xl text-gray-400 cute:text-purple-400 max-w-2xl mx-auto font-mono mb-10"
                >
                    {cute ? "full stack developer & cat person" : "Full Stack Developer"} —{" "}
                    <span className="text-violet-400 cute:text-pink-500">TypeScript</span> ·{" "}
                    <span className="text-cyan-400 cute:text-sky-500">React / Next.js</span> ·{" "}
                    <span className="text-fuchsia-400 cute:text-violet-500">Laravel</span> ·{" "}
                    <span className="text-sky-400 cute:text-sky-600">Azure</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <button onClick={startGame} className="btn-primary group">
                        <span>{cute ? "play with me! 🐱" : "ENTER SIMULATION"}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <a
                        href="https://github.com/Crackr25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost group"
                    >
                        <Github className="w-4 h-4" />
                        <span>GITHUB</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/echem-izakahr-07456927a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost group"
                    >
                        <Linkedin className="w-4 h-4" />
                        <span>LINKEDIN</span>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="pt-12 hidden md:block"
                >
                    <div className="glass p-2 rounded-lg inline-block">
                        <img
                            src={`https://ghchart.rshah.org/${cute ? "f472b6" : "8b5cf6"}/Crackr25`}
                            alt="Github Contribution Graph"
                            className="w-full h-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
            >
                <span className="text-[10px] font-mono tracking-[0.4em]">SCROLL</span>
                <div className="w-px h-10 bg-gradient-to-b from-violet-500 to-transparent overflow-hidden">
                    <motion.div
                        animate={{ y: [-40, 40] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-4 bg-cyan-400"
                    />
                </div>
            </motion.div>
        </section>
    );
}
