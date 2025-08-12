import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
