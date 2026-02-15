import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wizarding Worlds - A Project Genie Companion",
  description: "Generate immersive 3D wizarding worlds from text prompts using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
