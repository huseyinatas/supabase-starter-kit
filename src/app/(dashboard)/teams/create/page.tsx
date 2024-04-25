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
import PageHeader from "@/app/(dashboard)/teams/create/PageHeader";
import CreateTeamForm from "@/app/(dashboard)/teams/create/create-team-form";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
export default async function page() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const session = await supabase.auth.getSession();
  const user_id: string | any = session?.data?.session?.user.id;
  const profile = await supabase
    .from("profiles")
    .select("*, role(*)")
    .eq("id", user_id)
    .single();
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
              <Link href="/teams">Takımlar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Yeni Takım Ekle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="lg:max-w-3xl">
        <PageHeader />
        <CreateTeamForm profile={profile} />
      </div>
    </>
  );
}
