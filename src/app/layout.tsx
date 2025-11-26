import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import FlappyBackground from "@/components/FlappyBackground";
import UIWrapper from "@/components/UIWrapper";
import { GameProvider } from "@/context/GameContext";
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
        <GameProvider>
          <CustomCursor />
          <FlappyBackground />
          <UIWrapper>
            {children}
          </UIWrapper>
        </GameProvider>
      </body>
    </html>
  );
}
