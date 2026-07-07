import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudBase AI",
  description: "Company Knowledge, AI Guidance, and Workflow Automation Foundation prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
