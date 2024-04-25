import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { status } = await request.json();
  const { data, error } = await supabase
    .from("teams")
    .update({ status })
    .eq("id", params.slug);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ data: "success", status: 200 }, { status: 200 });
}
