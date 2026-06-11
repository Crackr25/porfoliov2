"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Gamepad2, Code, Database, Cpu, Globe } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { MouseEvent, ReactNode } from "react";

const projects = [
    {
        title: "Pinoy Global Supply",
        description: "Full-scale B2B marketplace connecting PH manufacturers to US buyers with secure payments.",
        tech: ["React", "Node.js", "Payment API"],
        status: "COMPLETE",
        difficulty: "EXTREME",
        demo: "https://pinoyglobalsupply.com/",
        github: null,
        image: "https://s0.wp.com/mshots/v1/https://pinoyglobalsupply.com/?w=800"
    },
    {
        title: "AI Misinformation Detector",
        description: "AI-powered tool detecting fake news using NLP techniques.",
        tech: ["Python", "NLP", "AI"],
        status: "COMPLETE",
        difficulty: "HARD",
        demo: "https://ai-misinformation-detector-neon.vercel.app/",
        github: "https://github.com/Crackr25/ai-misinformation-detector.git",
        image: "https://s0.wp.com/mshots/v1/https://ai-misinformation-detector-neon.vercel.app/?w=800"
    },
    {
        title: "Resume Matcher (AI)",
        description: "AI tool comparing resumes with job descriptions for suitability.",
        tech: ["Python", "AI", "Data Analysis"],
        status: "COMPLETE",
        difficulty: "HARD",
        demo: "https://resume-matcher-one-ochre.vercel.app/",
        github: "https://github.com/Crackr25/resume_matcher.git",
        image: "https://s0.wp.com/mshots/v1/https://resume-matcher-one-ochre.vercel.app/?w=800"
    },
    {
        title: "Snake Identifier",
        description: "Image recognition app identifying snake species and venom status.",
        tech: ["Computer Vision", "AI", "Python"],
        status: "COMPLETE",
        difficulty: "HARD",
        demo: "https://snake-identifier.vercel.app/",
        github: "https://github.com/Crackr25/snake-identifier.git",
        image: "https://s0.wp.com/mshots/v1/https://snake-identifier.vercel.app/?w=800"
    },
    {
        title: "Breed Identifier",
        description: "Multimodal AI app detecting dog and cat breeds via interface.",
        tech: ["AI", "Image Processing", "Web"],
        status: "COMPLETE",
        difficulty: "NORMAL",
        demo: "https://breed-identifier.vercel.app/",
        github: "https://github.com/Crackr25/dog_cat-ai.git",
        image: "https://s0.wp.com/mshots/v1/https://breed-identifier.vercel.app/?w=800"
    },
    {
        title: "Party Play Platform",
        description: "Real-time multiplayer platform for Dama, UNO, and Tongits.",
        tech: ["Socket.io", "React", "Node.js"],
        status: "COMPLETE",
        difficulty: "EXTREME",
        demo: "https://party-play.vercel.app/login",
        github: "https://github.com/AngeloGetuaban/party-play.git",
        image: "https://s0.wp.com/mshots/v1/https://party-play.vercel.app/login?w=800"
    },
    {
        title: "Smart BG Remover",
        description: "Custom background removal tool built as an alternative to paid services.",
        tech: ["Django", "Python", "Image Proc"],
        status: "COMPLETE",
        difficulty: "HARD",
        demo: null,
        github: "https://github.com/Crackr25/background_remover.git",
        image: null
    },
    {
        title: "Task Manager (.NET)",
        description: "Efficient task management app focusing on clean CRUD functionality.",
        tech: [".NET", "C#", "SQL"],
        status: "COMPLETE",
        difficulty: "NORMAL",
        demo: null,
        github: "https://github.com/Crackr25/taskpro_master.git",
        image: null
    },
    {
        title: "Lunar Lander Game",
        description: "Physics-based game demonstrating gravity simulation and controls.",
        tech: ["JavaScript", "Canvas API", "Physics"],
        status: "COMPLETE",
        difficulty: "NORMAL",
        demo: "https://lunar-lander-seven.vercel.app/",
        github: "https://github.com/Crackr25/lunar_lander.git",
        image: "https://s0.wp.com/mshots/v1/https://lunar-lander-seven.vercel.app/?w=800"
    },
    {
        title: "PH Map Puzzle",
        description: "Educational puzzle game featuring Philippine map assets.",
        tech: ["Game Dev", "JavaScript", "Photoshop"],
        status: "COMPLETE",
        difficulty: "NORMAL",
        demo: "https://map-puzzle-nine.vercel.app/",
        github: "https://github.com/Crackr25/map_puzzle.git",
        image: "https://s0.wp.com/mshots/v1/https://map-puzzle-nine.vercel.app/?w=800"
    },
    {
        title: "Neon DJ",
        description: "Creative project inspired by music visualization tools.",
        tech: ["Web Audio API", "Visuals", "CSS"],
        status: "COMPLETE",
        difficulty: "NORMAL",
        demo: "https://neon-dj.vercel.app/",
        github: "https://github.com/Crackr25/neon_dj.git",
        image: "https://s0.wp.com/mshots/v1/https://neon-dj.vercel.app/?w=800"
    }
];

/* Card that tilts in 3D toward the cursor with a tracking glow. */
function TiltCard({ children, onClick, clickable }: { children: ReactNode; onClick?: () => void; clickable: boolean }) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 250, damping: 25 });
    const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 250, damping: 25 });
    const glowX = useTransform(x, [0, 1], ["0%", "100%"]);
    const glowY = useTransform(y, [0, 1], ["0%", "100%"]);

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
            onClick={onClick}
            className={`group relative glass rounded-xl overflow-hidden flex flex-col h-full transition-[border-color,box-shadow] duration-300 hover:border-violet-500/50 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.4)] ${clickable ? "cursor-pointer" : ""}`}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [glowX, glowY],
                        ([gx, gy]) => `radial-gradient(400px circle at ${gx} ${gy}, rgba(139,92,246,0.15), transparent 60%)`
                    ),
                }}
            />
            {children}
        </motion.div>
    );
}

export default function Projects() {
    const { startGame } = useGame();
    const { theme } = useTheme();
    const cute = theme === "cute";

    return (
        <section id="projects" className="py-28 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="section-label">{cute ? "02 / things i made" : "02 / ARCHIVES"}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-cyan-300 cute:from-sky-500 cute:to-pink-500 bg-clip-text text-transparent">
                        {cute ? "my litter of projects 🐈" : "MISSION LOG"}
                    </h2>
                </motion.div>

                {/* Stats Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
                >
                    {[
                        { label: cute ? "KITTENS BORN" : "TOTAL ARCHIVES", value: projects.length, icon: Database, color: cute ? "text-pink-500" : "text-cyan-400" },
                        { label: cute ? "OUT IN THE WILD" : "DEPLOYED", value: projects.filter(p => p.demo).length, icon: Globe, color: cute ? "text-sky-500" : "text-blue-400" },
                        { label: cute ? "TOYS IN THE BOX" : "TECH STACK", value: "15+", icon: Code, color: "text-purple-400" },
                        { label: cute ? "MOOD" : "SYS STATUS", value: cute ? "PURRING" : "ONLINE", icon: Cpu, color: "text-green-400" },
                    ].map((stat, i) => (
                        <div key={i} className="glass glass-hover rounded-lg p-5 flex flex-col items-center justify-center text-center group">
                            <stat.icon className={`w-6 h-6 mb-2 ${stat.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                            <div className="text-2xl font-bold text-white cute:text-purple-700 mb-1 font-mono">{stat.value}</div>
                            <div className="text-[10px] text-gray-400 cute:text-pink-400 tracking-widest font-mono">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-16"
                >
                    <button onClick={startGame} className="btn-ghost group text-cyan-400 border-cyan-500/40 hover:border-cyan-400 cute:text-pink-500 cute:border-pink-300">
                        <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        {cute ? "chase the laser! ✨" : "INITIATE TRAINING SIM"}
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: 1200 }}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: (index % 3) * 0.1, duration: 0.6 }}
                        >
                            <TiltCard
                                clickable={!!project.demo}
                                onClick={() => project.demo && window.open(project.demo, "_blank")}
                            >
                                <div className="h-48 w-full relative bg-black/50 overflow-hidden">
                                    {project.image ? (
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                                            <Gamepad2 className="w-12 h-12 text-violet-400/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-green-500/60 text-green-400 bg-black/70 backdrop-blur-sm">
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-4 z-10 text-[10px] text-gray-400 font-mono">
                                        DIFFICULTY: <span className="text-fuchsia-400">{project.difficulty}</span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold mb-3 text-white cute:text-purple-700 group-hover:text-violet-300 cute:group-hover:text-pink-500 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-400 cute:text-slate-500 mb-5 text-sm leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {project.tech.map((t) => (
                                            <span key={t} className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 cute:text-sky-600 cute:bg-sky-50 cute:border-sky-200 cute:rounded-full px-2 py-1 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-white/5 cute:border-pink-100">
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white hover:scale-110 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Github size={18} />
                                            </a>
                                        )}
                                        {project.demo && (
                                            <a
                                                href={project.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
