import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PageHeader from "@/app/(dashboard)/users/create/PageHeader";
import CreateUserForm from "@/app/(dashboard)/users/create/create-user-form";
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
              <Link href="/users">Kullanıcılar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Yeni Kullanıcı Ekle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="lg:max-w-3xl">
        <PageHeader />
        <CreateUserForm />
      </div>
    </>
  );
}
