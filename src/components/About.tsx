"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const arsenal = [
    { category: "LANGUAGES", items: ["TypeScript", "JavaScript", "PHP", "Python", "C#", "SQL"] },
    { category: "FRAMEWORKS", items: ["Next.js", "React", "Laravel", "Node.js", "Django", ".NET", "Tailwind CSS"] },
    { category: "CLOUD & DEVOPS", items: ["Azure", "Docker", "CI/CD Pipelines", "GitHub Actions", "Linux", "Nginx", "Vercel"] },
    { category: "TOOLS", items: ["Git", "Postman", "REST APIs", "WebSockets", "MySQL", "PostgreSQL"] },
];

const experience = [
    {
        year: "2024 - Present",
        role: "Full Stack Developer",
        company: "Freelance (Remote)",
        highlights: [
            "Developing scalable systems for multiple international clients.",
            "Building diverse solutions across various tech stacks & random projects.",
            "Managing Linux server deployments and infrastructure."
        ]
    },
    {
        year: "2023 - Present",
        role: "Lead Developer / DevOps",
        company: "CK Children's Publishing",
        highlights: [
            "Managed Organization Repo, Code Reviews, and Standards.",
            "Implemented CI/CD pipelines & handled DevOps tasks.",
            "Deployed and maintained 100+ school-related projects.",
            "Led development of educational management systems."
        ]
    },
    {
        year: "2022 - 2023",
        role: "Admin Assistant / Tech Support",
        company: "LGU Baungon",
        highlights: [
            "Provided technical support for local government systems.",
            "Automated payroll and report generation processes."
        ]
    },
];

export default function About() {
    const { theme } = useTheme();
    const cute = theme === "cute";
    return (
        <section id="about" className="py-28 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="section-label">{cute ? "01 / who's this kitty?" : "01 / IDENTITY"}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-violet-300 cute:from-pink-500 cute:to-violet-500 bg-clip-text text-transparent">
                        {cute ? "about meow 🐱" : "PLAYER PROFILE"}
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="glass glass-hover rounded-xl p-8"
                    >
                        <p className="text-gray-300 cute:text-slate-600 mb-4 leading-relaxed text-lg">
                            I&apos;m <span className="text-violet-400 cute:text-pink-500 font-bold">Izakahr Echem</span>, a Full Stack
                            Developer who ships products end to end — from{" "}
                            <span className="text-cyan-400 cute:text-sky-500">React/Next.js and TypeScript frontends</span> to{" "}
                            <span className="text-cyan-400 cute:text-sky-500">Laravel and Node.js backends</span>, deployed and
                            maintained on cloud infrastructure I manage myself.
                        </p>
                        <p className="text-gray-300 cute:text-slate-600 mb-8 leading-relaxed text-lg">
                            I&apos;ve <span className="text-violet-400 cute:text-pink-500 font-semibold">deployed and maintained 100+ production projects</span>,
                            led code reviews and engineering standards as a lead developer, built CI/CD pipelines that take
                            teams from commit to production automatically, and delivered for international clients across
                            time zones. IT graduate (<span className="text-violet-400 cute:text-pink-500">Cum Laude</span>), Cisco
                            Networking certified, and equally at home writing application code or administering the Linux
                            and Azure environments it runs on.
                        </p>

                        <div className="space-y-7">
                            {arsenal.map((group, index) => (
                                <div key={index}>
                                    <h4 className="section-label mb-3 block">{group.category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((item, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.04 }}
                                                whileHover={{ scale: 1.08, y: -2 }}
                                                className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-300 font-mono rounded hover:border-violet-500/60 hover:text-white hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] cute:bg-pink-50 cute:border-pink-200 cute:text-purple-600 cute:rounded-full cute:hover:bg-pink-100 cute:hover:text-pink-600 cute:hover:border-pink-400 transition-colors cursor-default"
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative pl-8">
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500 via-cyan-500 to-transparent cute:from-pink-400 cute:via-violet-300" />
                        <h3 className="text-xl font-bold mb-8 text-white cute:text-purple-600 tracking-widest">{cute ? "my adventures so far 🧶" : "MISSION LOG"}</h3>
                        {experience.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="relative glass glass-hover rounded-lg p-6 mb-6"
                            >
                                <div className="absolute -left-[37px] top-7 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] cute:bg-pink-400 cute:shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
                                <span className="text-cyan-400 cute:text-sky-500 font-mono text-xs tracking-widest">{item.year}</span>
                                <h4 className="text-xl font-bold text-white cute:text-purple-700 mt-1">{item.role}</h4>
                                <p className="text-violet-300/70 cute:text-pink-500 text-sm mb-3 font-mono">{item.company}</p>
                                <ul className="text-gray-400 cute:text-slate-500 text-sm space-y-1.5">
                                    {item.highlights.map((highlight, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-violet-500 cute:text-pink-400 mt-0.5">{cute ? "🐾" : "▹"}</span>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
