"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "PHP / Laravel", value: "100%" },
    { label: "JavaScript / React", value: "90%" },
    { label: "Linux / DevOps", value: "85%" },
    { label: "SQL / Database", value: "95%" },
];

const experience = [
    {
        year: "2024 - Present",
        role: "Full Stack Laravel Developer",
        company: "Freelance (Remote)",
        desc: "Developing scalable Laravel systems for international clients. Managing Linux server deployments."
    },
    {
        year: "2023 - Present",
        role: "Team Lead / Full-Stack Dev",
        company: "CK Children's Publishing",
        desc: "Leading development of educational management systems. Mentoring junior devs and overseeing architecture."
    },
    {
        year: "2022 - 2023",
        role: "Admin Assistant / Tech Support",
        company: "LGU Baungon",
        desc: "Provided technical support and automated payroll/report systems."
    },
];

export default function About() {
    return (
        <section id="about" className="py-20 px-6 bg-black/50 relative">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold mb-6 glitch-text" data-text="PLAYER PROFILE">
                        PLAYER PROFILE
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        I am <span className="text-primary font-bold">Izakahr Echem</span>, a Full Stack Web Developer specializing in <span className="text-accent">PHP, Laravel, and JavaScript</span>.
                        Based in Cagayan De Oro City, I build secure, scalable web applications and manage Linux server infrastructures.
                        With a background in IT (Cum Laude) and certifications in Cisco Networking, I combine robust backend logic with dynamic frontend experiences.
                    </p>

                    <div className="space-y-4">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-mono text-gray-300">{stat.label}</span>
                                    <span className="text-primary">{stat.value}</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: stat.value }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-accent block" />
                        MISSION LOG
                    </h3>
                    {experience.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white/5 p-6 border-l-2 border-gray-700 hover:border-accent transition-colors"
                        >
                            <span className="text-accent font-mono text-sm">{item.year}</span>
                            <h4 className="text-xl font-bold text-white mt-1">{item.role}</h4>
                            <p className="text-gray-400 text-sm mb-2">{item.company}</p>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
