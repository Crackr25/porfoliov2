"use client";

import { motion } from "framer-motion";

const arsenal = [
    { category: "LANGUAGES", items: ["PHP", "JavaScript", "TypeScript", "Python", "C#", "SQL", "HTML", "CSS"] },
    { category: "FRAMEWORKS", items: ["Laravel", "React", "Next.js", "Node.js", "Django", ".NET", "Tailwind CSS"] },
    { category: "TOOLS", items: ["Linux", "Git", "Docker", "VS Code", "Postman", "CI/CD"] },
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

                    <div className="space-y-6">
                        {arsenal.map((group, index) => (
                            <div key={index}>
                                <h4 className="text-accent font-mono text-xs tracking-widest mb-3 border-b border-accent/20 pb-1 inline-block">{group.category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((item, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-300 font-mono rounded-sm hover:border-primary/50 hover:text-white hover:bg-primary/10 transition-colors cursor-default">
                                            {item}
                                        </span>
                                    ))}
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
                            <p className="text-gray-400 text-sm mb-3">{item.company}</p>
                            <ul className="text-gray-500 text-sm list-disc list-inside space-y-1">
                                {item.highlights.map((highlight, i) => (
                                    <li key={i}>{highlight}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
