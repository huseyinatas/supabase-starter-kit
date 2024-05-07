import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Building,
  CircleUser,
  FileText,
  Home,
  LineChart,
  Menu,
  Package,
  ShieldHalf,
  ShoppingCart,
  Terminal,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Nav from "@/app/(dashboard)/nav";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const factor = await supabase.auth.mfa.listFactors();
  return (
    <div className="grid max-h-screen overflow-hidden min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-muted/40 backdrop-blur z-50 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Nav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/profile"}>Profil & Güvenlik</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form method="post" action="/api/auth/logout">
                  <button type="submit">Çıkış Yap</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid items-start max-h-screen gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 !pb-24 overflow-auto pt-6">
          {/*
            {factor.data?.totp?.length === 0 && (
            <Alert className="mt-6" variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>
                İki faktörlü kimlik doğrulaması aktif değil!
              </AlertTitle>
              <AlertDescription>
                Hesabınızda iki faktörlü kimlik doğrulaması etkinleştirilmemiş.
                Hesabınızı daha güvenli hale getirmek için iki faktörlü kimlik
                doğrulamasını etkinleştirin.
              </AlertDescription>
            </Alert>
          )}
             */}
          {children}
        </main>
      </div>
    </div>
  );
}
