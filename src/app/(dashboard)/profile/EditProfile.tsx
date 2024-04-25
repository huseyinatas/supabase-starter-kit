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
  displayName: string;
};

export default function EditProfile({ user }: Readonly<{ user: any }>) {
  const intl = useIntl();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const req = await fetch("/api/auth/update/profile-information", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await req.json();
    if (response.status !== 200) {
      toast.error("Hata", {
        description: "Bir hata oluştu",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
    }
    toast.success("Başarılı", {
      description: "Profil bilgileriniz başarıyla güncellendi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    router.refresh();
  };
  return (
    <div className="flex w-full flex-col gap-y-6">
      <PageHeadline
        header={
          <FormattedMessage
            defaultMessage="Kullanıcı Bilgileri"
            id="Auth / Profile details / Personal data header"
          />
        }
        subheader={
          <FormattedMessage
            defaultMessage="Kullanıcı bilgilerinizi güncelleyin"
            id="Auth / Profile details / Personal data label"
          />
        }
      />
      <div className="w-full">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "flex lg:max-w-xs flex-row flex-wrap items-end justify-center gap-4 md:max-w-full md:justify-start",
          )}
        >
          <div className="flex w-full flex-row flex-wrap gap-4">
            <Input
              {...register("displayName", {
                maxLength: {
                  value: 50,
                  message: intl.formatMessage({
                    defaultMessage: "Nickname çok uzun",
                    id: "Auth / Update profile/ Last name max length error",
                  }),
                },
              })}
              id="displayName"
              label={intl.formatMessage({
                defaultMessage: "Nickname",
                id: "Auth / Update profile / First name label",
              })}
              defaultValue={user?.user_metadata?.displayName}
              error={""}
            />
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className={`w-full md:w-fit ${isSubmitting ? "opacity-50" : ""}`}
          >
            <FormattedMessage
              defaultMessage="Profil bilgilerini güncelle"
              id="Auth / Update profile/ Submit button"
            />
          </Button>
        </form>
      </div>
    </div>
  );
}
