import React from "react";
import Link from "next/link";
import { ListFilter, PlusCircle } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TeamsTable from "@/app/(dashboard)/teams/teams-table";
import Navigation from "@/app/(dashboard)/teams/Navigation";
export default function page() {
  return (
    <>
      <Breadcrumb className="hidden md:flex mt-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Başlangıç</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/teams">Takımlar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Aktif Takımlar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
        <div className="flex items-center">
          <Navigation />
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtrele
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-4" align="end">
                <DropdownMenuLabel>Şuna göre filtrele</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/*
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                    */}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/teams/create">
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Yeni Takım Ekle
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TeamsTable variant="active" />
      </div>
    </>
  );
}
