import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// ...existing code...

// ...existing code...

export const metadata: Metadata = {
  title: "MindMate",
  description: "Your AI-powered mental health companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
  className={`antialiased`} 
      >
        {children}
      </body>
    </html>
  );
}
