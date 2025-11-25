"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[60]"
            style={{ scaleX }}
        >
            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-3 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>
    );
}
