"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Gamepad2, Code, Database, Cpu, Globe } from "lucide-react";
import { useGame } from "@/context/GameContext";
import Image from "next/image";

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

export default function Projects() {
    const { startGame } = useGame();

    return (
        <section id="projects" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center relative"
                >
                    <h2 className="text-4xl font-bold mb-4 glitch-text" data-text="MISSION LOG">
                        MISSION LOG
                    </h2>
                    <div className="h-1 w-20 bg-accent mx-auto mb-6" />

                </motion.div>

                {/* Stats Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto"
                >
                    {[
                        { label: "TOTAL ARCHIVES", value: projects.length, icon: Database, color: "text-accent" },
                        { label: "DEPLOYED", value: projects.filter(p => p.demo).length, icon: Globe, color: "text-blue-400" },
                        { label: "TECH STACK", value: "15+", icon: Code, color: "text-purple-400" },
                        { label: "SYS STATUS", value: "ONLINE", icon: Cpu, color: "text-green-400" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card-bg/50 border border-white/5 p-4 rounded-sm flex flex-col items-center justify-center text-center group hover:border-white/20 transition-colors">
                            <stat.icon className={`w-6 h-6 mb-2 ${stat.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                            <div className="text-2xl font-bold text-white mb-1 font-mono">{stat.value}</div>
                            <div className="text-[10px] text-gray-400 tracking-widest font-mono">{stat.label}</div>
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
                    <button
                        onClick={startGame}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/50 rounded-sm text-accent hover:bg-accent/20 hover:border-accent transition-all text-sm font-mono tracking-wider group"
                    >
                        <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        INITIATE TRAINING SIM
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-card-bg border border-card-border overflow-hidden hover:border-primary transition-colors duration-300 flex flex-col ${project.demo ? 'cursor-pointer' : ''}`}
                            onClick={() => project.demo && window.open(project.demo, '_blank')}
                        >
                            {/* Project Image / Placeholder */}
                            <div className="h-48 w-full relative bg-black/50 overflow-hidden group-hover:opacity-80 transition-opacity">
                                {project.image ? (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        unoptimized // mshots might have issues with next/image optimization sometimes, safer to unoptimize or ensure config is perfect. Let's try optimized first? No, let's stick to the plan but add sizes. mshots is dynamic. Let's keep it optimized as per plan, but if it fails I'll unoptimize.
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-accent/5">
                                        <Gamepad2 className="w-12 h-12 text-accent/20" />
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 z-10">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 border bg-black/80 backdrop-blur-sm ${project.status === 'COMPLETE' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>

                                <div className="text-[10px] text-gray-500 font-mono mb-4">
                                    DIFFICULTY: <span className="text-secondary">{project.difficulty}</span>
                                </div>

                                <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-1">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((t) => (
                                        <span key={t} className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1 rounded-sm">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Github size={20} />
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
