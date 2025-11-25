"use client";

import { Github, Linkedin, Twitter } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.socials}>
                <a href="#" className={styles.socialLink} aria-label="GitHub">
                    <Github size={20} />
                </a>
                <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                    <Linkedin size={20} />
                </a>
                <a href="#" className={styles.socialLink} aria-label="Twitter">
                    <Twitter size={20} />
                </a>
            </div>
            <p className={styles.copy}>
                Designed & Built by [Your Name]
            </p>
        </footer>
    );
}
