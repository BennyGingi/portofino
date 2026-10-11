import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";

// Display serif for headlines; Outfit for UI/body. Space Mono is inherited from
// the root layout for the terminal / threat-feed bits.
const cormorant = Cormorant_Garamond({
  weight: ["300"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Benny Gingihashvili — Signal in the Noise",
  description: "A cinematic redesign demo. SOC analyst and full-stack engineer.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${outfit.variable}`}>{children}</div>;
}
