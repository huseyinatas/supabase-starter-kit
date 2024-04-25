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

  const { data: factors, error } =
    await supabaseAdmin.auth.admin.mfa.listFactors({
      userId: userId,
    });

  if (!factors?.factors?.length || error)
    return NextResponse.json({ error: "no-factors" }, { status: 400 });
  console.log(factors);
  const { error: deleteError } =
    await supabaseAdmin.auth.admin.mfa.deleteFactor({
      id: factors.factors[0].id,
      userId: userId,
    });
  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 400 });

  return NextResponse.json({ data: "success", status: 200 });
}
