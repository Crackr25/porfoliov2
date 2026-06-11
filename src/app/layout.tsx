import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CustomCursor from "@/components/CustomCursor";
import GameMount from "@/components/GameMount";
import SceneMount from "@/components/three/SceneMount";
import UIWrapper from "@/components/UIWrapper";
import { GameProvider } from "@/context/GameContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLAYER 1 // PORTFOLIO",
  description: "Interactive Game-Style Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased cursor-none`}>
        <ThemeProvider>
        <GameProvider>
          <CustomCursor />
          <SceneMount />
          <GameMount />
          <UIWrapper>
            {children}
          </UIWrapper>
          <Analytics />
        </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
