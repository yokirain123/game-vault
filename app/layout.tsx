import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var savedTheme = localStorage.getItem("theme");
                var theme = savedTheme || "dark";

                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {
                document.documentElement.classList.add("dark");
              }
            })();
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col scrollbar-none">
        {children}
      </body>
    </html>
  );
}