import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SelectedProductProvider } from "@/context/SelectedProductContext";
import { SearchProvider } from "@/context/SearchContext";
import "./globals.css";

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
  description: "A library of Salesforce Einstein assets for Agentforce",
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
