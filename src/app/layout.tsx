import type { Metadata } from "next";
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";

// Initialize environment logging silently (this will execute and log to console)
import '@/config/env';

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-barlow',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarti Sabha - Digital Devotional Experience",
  description: "Connect with family across distances through synchronized aarti singing with SwarSetu technology",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aarti Sabha",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  shrinkToFit: "no",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aarti App" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} font-barlow antialiased`}
      >
        <LanguageProvider>
          <PWAInstaller />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
