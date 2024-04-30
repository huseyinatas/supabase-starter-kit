import React from "react";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./styles/globals.css";

import { cn } from "@/lib/utils";
import Providers from "@/utils/Providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DASKLA",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          <NextTopLoader />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
