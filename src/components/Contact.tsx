"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const channels = [
    { icon: Mail, label: "EMAIL", value: "izakahr25@gmail.com", href: "mailto:izakahr25@gmail.com" },
    { icon: Phone, label: "DIRECT LINE", value: "0916-2870-359", href: "tel:09162870359" },
    { icon: MapPin, label: "COORDINATES", value: "Cagayan De Oro City, PH", href: null },
];

export default function Contact() {
    const { theme } = useTheme();
    const cute = theme === "cute";
    return (
        <section id="contact" className="py-28 px-6 mb-12">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="section-label">{cute ? "03 / let's be friends" : "03 / TRANSMISSION"}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white to-fuchsia-300 cute:from-pink-500 cute:to-sky-500 bg-clip-text text-transparent">
                        {cute ? "say hi! ฅ^•ﻌ•^ฅ" : "ESTABLISH UPLINK"}
                    </h2>
                    <p className="text-gray-400 cute:text-slate-500 mt-4 font-mono text-sm">
                        {cute
                            ? "got a project, a job, or just cat pictures to share? my inbox is open!"
                            : "Ready to start a new mission? Send a transmission and let's collaborate."}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass rounded-2xl p-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                    <div className="grid sm:grid-cols-3 gap-1">
                        {channels.map((c, i) => {
                            const inner = (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="flex flex-col items-center gap-3 p-8 rounded-xl hover:bg-white/[0.04] transition-colors h-full"
                                >
                                    <c.icon className="w-6 h-6 text-violet-400 cute:text-pink-400" />
                                    <span className="section-label">{c.label}</span>
                                    <span className="text-white cute:text-purple-700 text-sm font-mono text-center break-all">{c.value}</span>
                                </motion.div>
                            );
                            return c.href ? (
                                <a key={i} href={c.href} className="block group">{inner}</a>
                            ) : (
                                <div key={i}>{inner}</div>
                            );
                        })}
                    </div>

                    <div className="text-center py-4 text-[10px] text-gray-600 cute:text-pink-300 font-mono tracking-[0.3em]">
                        {cute ? "🐾 no spam, only treats 🐾" : "⬤ ENCRYPTED CONNECTION SECURE"}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <a href="mailto:izakahr25@gmail.com" className="btn-primary">
                        {cute ? "send me a meow-ssage 💌" : "SEND TRANSMISSION"}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
