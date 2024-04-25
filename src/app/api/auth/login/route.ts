import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const { email, password } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const auth: any = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (auth.error) {
    return NextResponse.json({ error: auth.error.message, status: 400 });
  }

  const accessToken = auth.data?.session?.access_token;

  cookieStore.set("prx", accessToken, {
    expires: new Date(auth.data?.session?.expires_at),
  });

  return NextResponse.json({ data: accessToken, status: 200 });
}
