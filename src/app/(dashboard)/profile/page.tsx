import { cookies } from "next/headers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import AvatarAndInformation from "@/app/(dashboard)/profile/AvatarAndInformation";
import EditProfile from "@/app/(dashboard)/profile/EditProfile";
import PageHeader from "@/app/(dashboard)/profile/PageHeader";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import EditPassword from "@/app/(dashboard)/profile/EditPassword";
import TwoFactor from "@/app/(dashboard)/profile/TwoFactor";

export default async function Profile() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="lg:max-w-3xl">
      <Breadcrumb className="hidden md:flex mt-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Başlangıç</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AvatarAndInformation user={user} />
      <EditProfile user={user} />
      <EditPassword />
      <TwoFactor />
    </div>
  );
}
