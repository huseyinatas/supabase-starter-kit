import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { error } = await supabase.auth.getSession();
  if (error) {
    await supabase.auth.signOut();
    return NextResponse.rewrite(new URL("/auth/login", req.url));
  }
  if (!session) {
    return NextResponse.rewrite(new URL("/auth/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
