import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-headings",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NodeFlux",
  description: "Visual workflow automation for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${geist.variable} font-body antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
