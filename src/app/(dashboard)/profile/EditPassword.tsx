"use client";

import { PageHeadline } from "@/components/layout/PageHeadline";
import { FormattedMessage, useIntl } from "react-intl";
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Inputs = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function EditPassword() {
  const intl = useIntl();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      errors.confirmNewPassword = {
        type: "confirmNewPassword",
        message: intl.formatMessage({
          defaultMessage: "Şifreler uyuşmuyor",
          id: "Auth / Change password / Passwords do not match",
        }),
      };
      toast.error("Şifreler Uyuşmuyor", {
        description: "Girdiğiniz şifreler uyuşmuyor",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      reset({ newPassword: "", confirmNewPassword: "" });
      return;
    }
    const req = await fetch("/api/auth/update/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await req.json();
    if (response.status !== 200) {
      if (response.type === "oldPassword") {
        toast.error("Hata", {
          description: "Eski şifrenizi hatalı girdiniz. Çıkışınız yapılıyor...",
          action: {
            label: "Kapat",
            onClick: () => false,
          },
        });
        router.push("/auth/login");
        return;
      }
      toast.error("Hata", {
        description: "Bir hata oluştu",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
    }
    console.log(response);
    if (response.status === 200) {
      toast.success("Başarılı", {
        description: "Şifreniz başarıyla değiştirildi. Çıkışınız yapılıyor...",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      reset({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      router.refresh();
    }
  };
  return (
    <div className="flex w-full flex-col gap-y-6">
      <PageHeadline
        header={
          <FormattedMessage
            defaultMessage="Şifre Değiştir"
            id="Auth / Profile details / Personal data header"
          />
        }
        subheader={
          <FormattedMessage
            defaultMessage="Güvenliğiniz için şifrenizi değiştirin."
            id="Auth / Profile details / Personal data label"
          />
        }
      />
      <div className="w-full">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "flex flex-row flex-wrap items-end justify-center gap-4 md:max-w-full md:justify-start",
          )}
        >
          <div className="w-full">
            <Input
              {...register("oldPassword", {
                required: {
                  value: true,
                  message: intl.formatMessage({
                    defaultMessage: "Eski şifre boş bırakılamaz",
                    id: "Auth / Change password / Old password required",
                  }),
                },
              })}
              id="oldPassword"
              label={intl.formatMessage({
                defaultMessage: "Mevcut Şifreniz",
                id: "Auth / Update profile / Old password label",
              })}
              error={errors.oldPassword?.message}
            />
          </div>
          <div className="flex w-full flex-row flex-wrap gap-4">
            <Input
              {...register("newPassword", {
                required: {
                  value: true,
                  message: intl.formatMessage({
                    defaultMessage: "Yeni şifre boş bırakılamaz",
                    id: "Auth / Change password / Old password required",
                  }),
                },
              })}
              id="oldPassword"
              label={intl.formatMessage({
                defaultMessage: "Yeni Şifreniz",
                id: "Auth / Update profile / New password label",
              })}
              error={errors.newPassword?.message}
            />
            <Input
              {...register("confirmNewPassword", {
                required: {
                  value: true,
                  message: intl.formatMessage({
                    defaultMessage: "Yeni şifre boş bırakılamaz",
                    id: "Auth / Change password / Old password required",
                  }),
                },
              })}
              id="confirmNewPassword"
              label={intl.formatMessage({
                defaultMessage: "Yeni Şifrenizi Tekrar Girin",
                id: "Auth / Update profile / New password confirm label",
              })}
              error={errors.confirmNewPassword?.message}
            />
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className={`w-full md:w-fit ${isSubmitting ? "opacity-50" : ""}`}
          >
            <FormattedMessage
              defaultMessage="Şifreyi Değiştir"
              id="Auth / Update profile/ Submit button"
            />
          </Button>
        </form>
      </div>
    </div>
  );
}
