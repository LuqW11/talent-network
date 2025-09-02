import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Talent Wharf | Selective introductions to high growth teams",
  description: "Join the waitlist for selective introductions to high growth, well-funded teams. Connect with top opportunities at a16z, Sequoia, Index, and GC portfolio companies.",
  keywords: ["talent", "jobs", "startup", "high growth", "engineering", "careers"],
  authors: [{ name: "Talent Wharf" }],
  openGraph: {
    title: "Talent Wharf | Selective introductions to high growth teams",
    description: "Join the waitlist for selective introductions to high growth, well-funded teams.",
    type: "website",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-black antialiased">
        {children}
      </body>
    </html>
  );
}
