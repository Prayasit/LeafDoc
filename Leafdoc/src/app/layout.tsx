import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist Sans as a clean sans-serif
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LeafDoc - Plant Identification & Care, Simplified',
  description: 'Identify plants, detect diseases, and get expert care information with LeafDoc. Your AI-powered plant assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(geistSans.variable, "scroll-smooth")}>
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
