"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const emailPattern =
  /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,63}$/;

export default function LoginForm() {
  const intl = useIntl();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isLoading },
  } = useForm<Inputs>();
  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    const req = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await req.json();
    if (res.status === 400) {
      toast.error("Hatalı Giriş Denemesi", {
        description: "E-Posta veya şifre hatalı",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      reset({ password: "" });
    }
    if (res.status === 200) {
      toast.success("Giriş Başarılı", {
        description: "Yönlendiriliyorsunuz...",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      router.refresh();
    }
  };

  return (
    <form
      noValidate
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit(handleLogin)}
    >
      <Input
        {...register("email", {
          required: {
            value: true,
            message: intl.formatMessage({
              defaultMessage: "E-Posta boş bırakılamaz",
              id: "Auth / Login / Email required",
            }),
          },
          pattern: {
            value: emailPattern,
            message: intl.formatMessage({
              defaultMessage: "E-Posta formatı hatalıdır",
              id: "Auth / Login / Email format error",
            }),
          },
        })}
        type="email"
        required
        label={intl.formatMessage({
          defaultMessage: "E-Posta",
          id: "Auth / Login / Email label",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "E-Posta adresinizi yazın...",
          id: "Auth / Login / Email placeholder",
        })}
        error={errors.email?.message}
      />

      <Input
        {...register("password", {
          required: {
            value: true,
            message: intl.formatMessage({
              defaultMessage: "Şifre boş bırakılamaz",
              id: "Auth / Login / Password required",
            }),
          },
        })}
        type="password"
        required
        label={intl.formatMessage({
          defaultMessage: "Şifre",
          id: "Auth / Login / Password label",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Şifrenizi yazın...",
          id: "Auth / Login / Password placeholder",
        })}
        error={errors.password?.message}
      />
      <Button
        className={`${isLoading && "opacity-35"}`}
        disabled={isLoading}
        type="submit"
      >
        <FormattedMessage defaultMessage="Giriş Yap" id="Auth / login button" />
      </Button>
    </form>
  );
}
