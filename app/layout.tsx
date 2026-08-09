import type { Metadata } from "next";
import { Inter, Space_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ 
  weight: ["400", "700"],
  subsets: ["latin"], 
  variable: "--font-space-mono" 
});
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron" 
});

export const metadata: Metadata = {
  title: "Benny Gingihashvili - SOC Analyst & Full-Stack Developer",
  description: "Portfolio of Benny Gingihashvili, SOC Analyst and Full-Stack Developer.",
};

import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${orbitron.variable} antialiased`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
