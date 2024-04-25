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
  const factors = (await supabase.auth.mfa.listFactors()) as any;
  if (!factors)
    return NextResponse.json({ error: "No factors" }, { status: 400 });
  factors?.data?.totp?.map(async (factor: any) => {
    await supabase.auth.mfa.unenroll({ factorId: factor.id });
  });

  await supabase.auth.refreshSession();
  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  return NextResponse.json({ data: "success", status: 200 });
}
