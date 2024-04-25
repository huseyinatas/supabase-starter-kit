import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";
import { supabaseAdmin } from "@/utils/supabase";

export async function POST(request: Request) {
  const { email, displayName, role_name, password, team, organization } =
    await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const roleName = role_name?.split("+")[1];
  const role = role_name?.split("+")[0];
  let user_data: any = {
    email,
    displayName,
    password,
    role,
    organization,
    team,
  };
  if (roleName === "organization-admin" && roleName === "organization-user") {
    user_data = { ...user_data, organization };
  }
  if (
    roleName === "team-admin" &&
    roleName === "user" &&
    roleName === "user-viewing"
  ) {
    user_data = { ...user_data, team };
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user_data.email,
    password: user_data.password,
    user_metadata: {
      displayName: user_data.displayName,
    },
    ban_duration: "none",
    email_confirm: true,
  });
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: data?.user?.id,
      email: user_data.email,
      role: user_data.role,
      organization: user_data.organization,
      team: user_data.team,
      display_name: user_data.displayName,
      status: "active",
      creator: session?.user?.id || null,
    },
  ]);
  if (profileError)
    return NextResponse.json({ error: profileError }, { status: 400 });
  return NextResponse.json({ data: "success", status: 200 }, { status: 200 });
}
