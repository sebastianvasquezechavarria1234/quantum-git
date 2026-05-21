import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
        />
      </head>
      <body className="min-h-full bg-[#0a0a0c] text-[#ededed] font-sans">
        {children}
      </body>
    </html>
  );
}
