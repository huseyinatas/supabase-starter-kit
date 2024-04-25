"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/users" passHref>
            <Button
              size="sm"
              className={
                pathname === "/users"
                  ? "bg-foreground text-white hover:bg-foreground hover:text-white"
                  : ""
              }
              variant="outline"
              type="button"
            >
              Tümü
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/users/active" passHref>
            <Button
              size="sm"
              className={
                pathname === "/users/active"
                  ? "bg-foreground text-white hover:bg-foreground hover:text-white"
                  : ""
              }
              variant="outline"
              type="button"
            >
              Aktif Kullanıcılar
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/users/inactive" passHref>
            <Button
              size="sm"
              className={
                pathname === "/users/inactive"
                  ? "bg-foreground text-white hover:bg-foreground hover:text-white"
                  : ""
              }
              variant="outline"
              type="button"
            >
              Pasif Kullanıcılar
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
