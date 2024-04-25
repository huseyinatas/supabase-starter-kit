import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;
  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { data, error } = await supabase.from("roles").select("*");

  return NextResponse.json({ data: data, status: 200 });
}
