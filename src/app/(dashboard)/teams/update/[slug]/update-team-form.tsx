"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import FileUploader from "@/utils/FileUpload";
type Inputs = {
  name: string;
  logo: any | null;
  organization: any | null;
  definitions: {
    commission: number;
    telegram_bot_token: string;
    telegram_chat_id: string;
    daily_limit: number;
  };
};

export default function UpdateTeamForm({
  profile,
  team,
}: {
  profile: any;
  team: any;
}) {
  const intl = useIntl();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: team?.name,
      logo: team?.logo,
      organization: team?.organization?.id,
      definitions: team?.definitions,
    },
  });

  const { data: organizations } = useQuery({
    queryKey: ["auth-admin-organizations"],
    queryFn: () => fetch("/api/admin/organizations").then((res) => res.json()),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const req = await fetch("/api/teams/update/" + team?.id, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await req.json();
    if (res.status !== 200) {
      toast.error("Hata", {
        description: "Bir hata oluştu",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      return;
    }
    toast.success("Başarılı", {
      description: "Takım başarıyla güncellendi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    router.push("/teams");
    router.refresh();
  };
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex flex-row flex-wrap items-end justify-center gap-4 md:max-w-full md:justify-start",
      )}
      encType={"multipart/form-data"}
    >
      <div className="flex w-full flex-row flex-wrap gap-4 mt-5">
        <div className="w-full p-4 border border-dashed">
          <FileUploader watch={watch} setValue={setValue} />
        </div>

        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Takım Adı",
            id: "Auth / Update profile / First name label",
          })}
          defaultValue={""}
          error={""}
          {...register("name", { required: true })}
        />
        {profile?.data?.role?.name === "supervisor" && (
          <div className="relative w-full md:max-w-xs">
            <label htmlFor="teams" className="order-first mb-1 text-xs">
              <span className="order-first mb-1 text-xs">
                Takım Organizasyonu
              </span>
            </label>
            <Select
              required={true}
              onValueChange={(e) => setValue("organization", e)}
              defaultValue={team?.organization?.id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Takım Organizasyonunu Seçin" />
              </SelectTrigger>
              <SelectContent id="teams" className="!w-full">
                <SelectGroup>
                  {organizations?.data?.map((organization: any) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Telegram Bot Token",
            id: "Auth / Update profile / Bot token name label",
          })}
          defaultValue={""}
          error={""}
          type="text"
          {...register("definitions.telegram_bot_token")}
        />
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Telegram Chat ID",
            id: "Auth / Update profile / Bot chat name label",
          })}
          defaultValue={""}
          error={""}
          type="text"
          {...register("definitions.telegram_chat_id")}
        />
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Komisyon Oranı",
            id: "Auth / Update profile / Komisyon name label",
          })}
          defaultValue={""}
          error={""}
          type="number"
          min="0"
          max="100"
          step="0.01"
          {...register("definitions.commission", { required: true })}
        />
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Günlük Limit",
            id: "Auth / Update profile / limit name label",
          })}
          defaultValue={""}
          error={""}
          type="number"
          min="0"
          {...register("definitions.daily_limit", { required: true })}
        />
      </div>
      <Button
        disabled={isSubmitting}
        className={`${isSubmitting && "opacity-90"}`}
        type="submit"
      >
        <FormattedMessage
          defaultMessage="Takımı Düzenle"
          id="Auth / Add Two-factor / Verify & Activate button"
        />
      </Button>
    </form>
  );
}
