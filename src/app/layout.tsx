import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quantum Git — 3D Commit Galaxy",
  description:
    "Visualize any GitHub repository as an immersive 3D galaxy. Explore commits as stars, branches as nebulae, and merges as cosmic bridges.",
  openGraph: {
    title: "Quantum Git — 3D Commit Galaxy",
    description:
      "Visualize any GitHub repository as an immersive 3D galaxy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0c] text-[#ededed] font-sans">
        {children}
      </body>
    </html>
  );
}
