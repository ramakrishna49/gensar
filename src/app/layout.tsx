import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gensar Admin",
  description: "Admin dashboard for Gensar website management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
