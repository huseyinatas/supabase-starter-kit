"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { IntlProvider } from "react-intl";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Providers({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return (
    <IntlProvider locale="tr" defaultLocale="tr">
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}
