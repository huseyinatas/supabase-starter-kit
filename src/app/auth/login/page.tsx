import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import LoginForm from "@/app/auth/login/login-form";
import Image from "next/image";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { redirect } from "next/navigation";
import Logo from "../../../../public/logo.svg";
export default async function Page() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;
  if (session) {
    redirect("/");
  }
  return (
    <div>
      <Header className="bg-background/80" />
      <div
        className={cn(
          "m-auto flex max-w-xs flex-col items-center justify-center mt-16 2xl:mt-32",
        )}
      >
        <Image
          className="mb-3"
          src={Logo}
          width={130}
          height={40}
          alt={"logo"}
        />
        <h3 className="mb-4">Hesabınıza giriş yapın</h3>
        <LoginForm />
      </div>
    </div>
  );
}
