import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hacker House Goa 2026 — Builder Identity Studio",
  description: "Generate your official verifiable Builder Identity Pass for Hacker House Goa 2026.",
  icons: {
    icon: "/goa-hindi-badge.png",
    shortcut: "/goa-hindi-badge.png",
    apple: "/goa-hindi-badge.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}