"use client";
import Link from "next/link";
import {
  Building,
  FileText,
  Home,
  Package,
  ShieldHalf,
  Users,
} from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-2 text-lg font-medium">
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
  );
}
