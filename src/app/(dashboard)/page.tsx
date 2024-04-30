import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function Page() {
  return (
    <main>
      <Breadcrumb className="hidden md:flex mt-5">
        <BreadcrumbList>
          {/*
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Başlangıç</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
           */}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Başlangıç</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </main>
  );
}
