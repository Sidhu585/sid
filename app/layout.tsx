import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Sid's Birthday";
const description = "Celebrate Sid's birthday. Wish him or contribute to the celebration.";

// Defensive: a malformed NEXT_PUBLIC_SITE_URL (stray quotes, missing
// protocol, etc.) should never crash the entire build — every page reads
// this file. Fall back to a safe placeholder instead of throwing.
function safeSiteUrl(): URL {
  try {
    return new URL(SITE_CONFIG.siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}
const siteUrl = safeSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl.toString(),
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#170F1C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}