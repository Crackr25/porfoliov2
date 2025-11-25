"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Gamepad2 } from "lucide-react";
import { useGame } from "@/context/GameContext";

const projects = [
    {
        title: "Health Info System",
        description: "Secure data workflows for hospitals/clinics with HIPAA-style protection.",
        tech: ["Laravel", "MySQL", "Role-Based Access"],
        status: "COMPLETE",
        difficulty: "HARD",
    },
    {
        title: "Learning Management System",
        description: "EdTech platform for schools with grading, assignments, and communication modules.",
        tech: ["Laravel", "Docker", "REST API"],
        status: "COMPLETE",
        difficulty: "HARD",
    },
    {
        title: "Facial Recognition System",
        description: "Real-time secure facial recognition backend using Python & OpenCV.",
        tech: ["Flask", "OpenCV", "Python"],
        status: "COMPLETE",
        difficulty: "EXTREME",
    },
    {
        title: "Eva - Art Sharing",
        description: "Artist collaboration platform built for Google Solution Challenge.",
        tech: ["Kotlin", "Firebase", "Android"],
        status: "COMPLETE",
        difficulty: "NORMAL",
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

                    <button
                        onClick={startGame}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/50 rounded-sm text-accent hover:bg-accent/20 hover:border-accent transition-all text-sm font-mono tracking-wider"
                    >
                        <Gamepad2 className="w-4 h-4" />
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
                            className="group relative bg-card-bg border border-card-border p-6 hover:border-primary transition-colors duration-300"
                        >
                            <div className="absolute top-0 right-0 p-2">
                                <span className={`text-xs font-mono px-2 py-1 border ${project.status === 'COMPLETE' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                                    {project.status}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>

                            <div className="text-xs text-gray-500 font-mono mb-4">
                                DIFFICULTY: <span className="text-secondary">{project.difficulty}</span>
                            </div>

                            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tech.map((t) => (
                                    <span key={t} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-sm">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Github size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
