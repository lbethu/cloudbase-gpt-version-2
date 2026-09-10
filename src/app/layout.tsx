import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/shell/ThemeScript";

export const metadata: Metadata = {
  title: { default: "CloudBase AI", template: "%s · CloudBase AI" },
  description: "Cloudpoint Knowledge & Intelligence Hub — one place to discover Cloudpoint knowledge, SOPs, R&D, capabilities, projects, AI copilots, automations, and technical guidance.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
