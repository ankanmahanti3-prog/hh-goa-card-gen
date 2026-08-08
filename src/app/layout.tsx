import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HH Goa 2026 • Builder Pass Generator',
  description: 'Create, customize, and share your official Hacker House Goa 2026 Builder Pass.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#01120e] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}