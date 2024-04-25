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
type Inputs = {
  email: string;
  displayName: string;
  role: string;
  role_name: string;
  password: string;
  team: string | null;
  organization: string | null;
};

export default function CreateUserForm() {
  const intl = useIntl();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const { data: roles } = useQuery({
    queryKey: ["auth-admin-roles"],
    queryFn: () => fetch("/api/admin/roles").then((res) => res.json()),
  });
  const { data: teams } = useQuery({
    queryKey: ["auth-admin-teams"],
    queryFn: () => fetch("/api/admin/teams").then((res) => res.json()),
  });
  const { data: organizations } = useQuery({
    queryKey: ["auth-admin-organizations"],
    queryFn: () => fetch("/api/admin/organizations").then((res) => res.json()),
  });
  const onSelectedRole = (role: string) => {
    reset({ organization: null, team: null });
    setValue("role_name", role);
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const req = await fetch("/api/auth/users/create", {
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
      description: "Kullanıcı başarıyla oluşturuldu",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    router.push("/users");
  };
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex flex-row flex-wrap items-end justify-center gap-4 md:max-w-full md:justify-start",
      )}
    >
      <div className="flex w-full flex-row flex-wrap gap-4 mt-5">
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "E-Posta",
            id: "Auth / Update profile / First name label",
          })}
          defaultValue={""}
          error={""}
          {...register("email", { required: true })}
        />
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Nickname",
            id: "Auth / Update profile / First name label",
          })}
          defaultValue={""}
          error={""}
          {...register("displayName", { required: true })}
        />
        <div className="relative w-full md:max-w-xs">
          <label htmlFor="roles" className="order-first mb-1 text-xs">
            <span className="order-first mb-1 text-xs">Kullanıcı Rolü</span>
          </label>
          <Select onValueChange={(e) => onSelectedRole(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kullanıcı Rolünü Seçin" />
            </SelectTrigger>
            <SelectContent id="roles" className="!w-full">
              <SelectGroup>
                {roles?.data?.map((role: any) => (
                  <SelectItem key={role.id} value={role.id + "+" + role.name}>
                    {role.description}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input
          id="displayName"
          label={intl.formatMessage({
            defaultMessage: "Kullanıcı Şifresi",
            id: "Auth / Update profile / First name label",
          })}
          defaultValue={""}
          error={""}
          {...register("password", { required: true })}
        />
        {watch("role_name")?.split("+")[1] !== "supervisor" &&
          watch("role_name") !== "" &&
          (watch("role_name")?.split("+")[1] === "user" ||
            watch("role_name")?.split("+")[1] === "user-viewing" ||
            watch("role_name")?.split("+")[1] === "team-admin") && (
            <div className="relative w-full md:max-w-xs">
              <label htmlFor="teams" className="order-first mb-1 text-xs">
                <span className="order-first mb-1 text-xs">
                  Kullanıcı Takımı
                </span>
              </label>
              <Select onValueChange={(e) => setValue("team", e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kullanıcı Takımını Seçin" />
                </SelectTrigger>
                <SelectContent id="teams" className="!w-full">
                  <SelectGroup>
                    {teams?.data?.map((team: any) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team?.organization?.name + " - " + team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        {watch("role_name")?.split("+")[1] !== "supervisor" &&
          watch("role_name") !== "" &&
          (watch("role_name")?.split("+")[1] === "organization-admin" ||
            watch("role_name")?.split("+")[1] === "organization-user") && (
            <div className="relative w-full md:max-w-xs">
              <label htmlFor="teams" className="order-first mb-1 text-xs">
                <span className="order-first mb-1 text-xs">
                  Kullanıcı Organizasyonu
                </span>
              </label>
              <Select onValueChange={(e) => setValue("organization", e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kullanıcı Organizasyonunu Seçin" />
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
      </div>
      <Button
        disabled={isSubmitting}
        className={`${isSubmitting && "opacity-90"}`}
        type="submit"
      >
        <FormattedMessage
          defaultMessage="Kullanıcı Oluştur"
          id="Auth / Add Two-factor / Verify & Activate button"
        />
      </Button>
    </form>
  );
}
