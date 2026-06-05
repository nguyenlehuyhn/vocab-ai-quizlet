import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vocab AI Quizlet",
  description: "Generate Vietnamese vocabulary cards and Quizlet import text."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
