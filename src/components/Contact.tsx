"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-6 mb-20">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-card-bg border border-card-border p-8 rounded-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

                    <h2 className="text-3xl font-bold mb-6 glitch-text" data-text="ESTABLISH UPLINK">
                        ESTABLISH UPLINK
                    </h2>

                    <p className="text-gray-400 mb-8 font-mono">
                        Ready to start a new mission? Send a transmission and let's collaborate.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4">
                            <Mail className="text-primary w-6 h-6" />
                            <a href="mailto:izakahr25@gmail.com" className="text-xl hover:text-primary transition-colors">izakahr25@gmail.com</a>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Phone className="text-primary w-6 h-6" />
                            <a href="tel:09162870359" className="text-xl hover:text-primary transition-colors">0916-2870-359</a>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <MapPin className="text-primary w-6 h-6" />
                            <span className="text-xl">Cagayan De Oro City, Philippines</span>
                        </div>
                    </div>

                    <div className="mt-8 text-xs text-gray-600 font-mono">
                        ENCRYPTED CONNECTION SECURE
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
