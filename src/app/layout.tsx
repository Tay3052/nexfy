import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "./_components/Header";
import React from "react";
import "./globals.css";
import { UIProvider } from "@yamada-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Analyser",
  description: "Analyse your favorite music on Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UIProvider>
          <Header />
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
