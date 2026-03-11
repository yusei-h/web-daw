import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Studio DAW",
  description: "Next.js 16 App Router で構築された本格的 Web DAW",
};

import { I18nProvider } from "@/contexts/i18n-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-950 text-gray-100 min-h-screen">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
