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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navigation from "@/app/(dashboard)/users/Navigation";
import UsersTable from "@/app/(dashboard)/users/users-table";

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
            <BreadcrumbLink asChild>
              <Link href="/">Kullanıcılar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pasif Kullanıcılar</BreadcrumbPage>
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
            <Link href="/users/create">
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Yeni Kullanıcı Ekle
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <UsersTable variant="inactive" />
      </div>
    </>
  );
}
