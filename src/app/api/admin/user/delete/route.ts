import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";
import { supabaseAdmin } from "@/utils/supabase";

export async function POST(request: Request) {
  const { userId } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  if (profileError)
    return NextResponse.json({ error: profileError }, { status: 400 });
  return NextResponse.json({ data: "success", status: 200 });
}
