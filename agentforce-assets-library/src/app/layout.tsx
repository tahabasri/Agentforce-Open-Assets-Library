import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SelectedProductProvider } from "@/context/SelectedProductContext";
import { SearchProvider } from "@/context/SearchContext";
import "./globals.css";

import { GITHUB_PUBLIC_URL } from '@/constants/global';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentforce Open Assets Library",
  description: "A library of Salesforce assets for Agentforce",
  viewport: "width=device-width, initial-scale=1.0",
  keywords: 'Agentforce, Salesforce, open assets, icons, images, industry assets, product assets, free resources',
  openGraph: {
    title: 'Agentforce Open Assets Library',
    description: 'Explore a curated library of open assets for Agentforce and Salesforce.',
    url: 'https://agentforce.sfdefacto.com',
    siteName: 'Agentforce Open Assets Library',
    images: [
      {
        url: `${GITHUB_PUBLIC_URL}/agentforce-assets-library/public/images/hero-image.png`,
        width: 1200,
        height: 630,
        alt: 'Agentforce Open Assets Library',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentforce Open Assets Library',
    description: 'Discover open-source assets for Agentforce and Salesforce.',
    site: '@thetahabasri',
    creator: '@thetahabasri',
    images: [`${GITHUB_PUBLIC_URL}/agentforce-assets-library/public/images/hero-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 min-h-screen`}
      >
        <div className="fixed inset-0 z-[-1] bg-noise opacity-[0.03] mix-blend-soft-light pointer-events-none"></div>
        <SelectedProductProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </SelectedProductProvider>
      </body>
    </html>
  );
}
