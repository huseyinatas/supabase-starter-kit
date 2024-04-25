import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const { oldPassword, newPassword, confirmNewPassword } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session?.user?.email,
    password: oldPassword,
  });
  if (signInError)
    return NextResponse.json(
      { type: "oldPassword", error: "Eski şifrenizi hatalı girdiniz." },
      { status: 400 },
    );

  await supabase.auth.updateUser({ password: newPassword });
  await supabase.auth.signOut();
  return NextResponse.json(
    {
      message: "Şifre değiştirme başarılı.",
      status: 200,
    },
    { status: 200 },
  );
}
