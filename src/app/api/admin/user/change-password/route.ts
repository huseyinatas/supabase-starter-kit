import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/lib/database.types";
import { supabaseAdmin } from "@/utils/supabase";

export async function POST(request: Request) {
  const { userId, newPassword } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;
  console.log(userId, newPassword);
  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(
    {
      message: "Şifre değiştirme başarılı.",
      status: 200,
    },
    { status: 200 },
  );
}
