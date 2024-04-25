"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string): string =>
    pathname === path
      ? "bg-foreground text-white hover:bg-foreground hover:text-white"
      : "";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/teams" passHref>
            <Button size="sm" className={isActive("/teams")} variant="outline">
              Tümü
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/teams/active" passHref>
            <Button
              size="sm"
              className={isActive("/teams/active")}
              variant="outline"
            >
              Aktif Takımlar
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/teams/inactive" passHref>
            <Button
              size="sm"
              className={isActive("/teams/inactive")}
              variant="outline"
            >
              Pasif Takımlar
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
