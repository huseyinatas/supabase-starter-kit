import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  //const requestUrl = new URL(request.url);
  const { displayName } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { error } = await supabase.auth.updateUser({
    data: { displayName: displayName },
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ status: 200 });
}
