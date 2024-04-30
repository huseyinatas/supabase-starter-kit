"use client";
import Link from "next/link";
import {
  Bell,
  Building,
  FileText,
  Home,
  LineChart,
  Package,
  Shield,
  ShieldHalf,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex min-h-screen max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" width={110} height={25} alt={"logo"} />
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname === "/" ? "bg-muted text-primary" : ""}`}
            >
              <Home className="h-4 w-4" />
              Başlangıç
            </Link>
            <div className="flex items-center w-full py-4">
              <div className="flex-grow border-t border-gray-300 max-w-[30px]"></div>

              <span className="px-3 tracking-wide text-sm text-gray-500">
                Poliçe İşlemleri
              </span>

              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Link
              href="/offers"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname === "/offers" ? "bg-muted text-primary" : ""}`}
            >
              <Package className="h-4 w-4" />
              Teklifler{" "}
            </Link>
            <Link
              href="/policies"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Poliçeler{" "}
            </Link>
            {/*
               <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
               */}
            <div className="flex items-center w-full py-4">
              <div className="flex-grow border-t border-gray-300 max-w-[30px]"></div>

              <span className="px-3 tracking-wide text-sm text-gray-500">
                Yönetim
              </span>

              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Link
              href="/users"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname.includes("/users") ? "bg-muted text-primary" : ""}`}
            >
              <Users className="h-4 w-4" />
              Kullanıcılar
            </Link>
            <Link
              href="/teams"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname.includes("/teams") ? "bg-muted text-primary" : ""}`}
            >
              <ShieldHalf className="h-4 w-4" />
              Takımlar
            </Link>
            <Link
              href="/organizations"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname.includes("/organizations") ? "bg-muted text-primary" : ""}`}
            >
              <Building className="h-4 w-4" />
              Organizasyonlar
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
