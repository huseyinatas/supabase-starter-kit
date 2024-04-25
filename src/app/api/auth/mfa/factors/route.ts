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
  const factor = await supabase.auth.mfa.listFactors();
  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  return NextResponse.json({ data: factor.data, status: 200 });
}
