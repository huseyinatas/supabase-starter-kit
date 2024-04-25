import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page: any = Number(searchParams.get("page")) + 1 || 1;
  const items: any = searchParams.get("items") || 20;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { data, error, count } = await supabase
    .from("teams")
    .select("*, organization(name), creator(display_name)", { count: "exact" })
    .range((page - 1) * items, page * items - 1)
    .limit(items)
    .eq("status", "active")
    .neq("id", session.user.id);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(
    {
      data: data,
      status: 200,
      meta: {
        total_count: count,
        items_count: items,
        current_page: page,
        total_page: Math.ceil(Number(count) / items),
        next_page: page * items >= Number(count) ? null : page,
        prev_page: page === 1 ? null : page - 2,
      },
    },
    { status: 200 },
  );
}
