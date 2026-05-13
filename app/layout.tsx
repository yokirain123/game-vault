import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Vault",
  description: "Your ultimate destination for gaming news, reviews, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col scrollbar-none">
        {children}
      </body>
    </html>
  );
}
