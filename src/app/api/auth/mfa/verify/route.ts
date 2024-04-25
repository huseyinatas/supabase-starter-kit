import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const { factorId, verifyCode } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;
  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const challenge = await supabase.auth.mfa.challenge({ factorId });

  if (challenge.error)
    return NextResponse.json({ error: challenge.error }, { status: 400 });

  const challengeId = challenge.data.id;

  const verify = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code: verifyCode,
  });

  if (verify.error)
    return NextResponse.json({ error: verify.error }, { status: 400 });

  return NextResponse.json({ data: verify, status: 200 });
}
