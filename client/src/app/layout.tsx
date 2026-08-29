import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "KONSTANZ | Party & Event Finder",
  description: "Discover events, clubs, bars, and nightlife in Konstanz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080809] text-zinc-100 selection:bg-[#CCFF00] selection:text-black">
        {children}
      </body>
    </html>
  );
}
