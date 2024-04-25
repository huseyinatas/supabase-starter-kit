"use client";

import { PageHeadline } from "@/components/layout/PageHeadline";
import { FormattedMessage } from "react-intl";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { H1, H4, Paragraph } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TwoFactor() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string>("");
  const [factorData, setFactorData] = useState<any>({});
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const closeRef = useRef() as any;

  const onOpenDialog = async (e: boolean) => {
    if (e) {
      const request = await fetch("/api/auth/mfa/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await request.json();
      setFactorId(data?.data.id);
      setFactorData(data?.data);
    } else {
      if (!isVerified) {
        const request = await fetch("/api/auth/mfa/unenroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: factorId }),
        });
        setFactorId("");
        setFactorData({});
      } else {
        setFactorId("");
        setFactorData({});
        setIsVerified(false);
      }
    }
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!verifyCode) {
      setError("Doğrulama kodu boş olamaz");
      return;
    }
    const request = await fetch("/api/auth/mfa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verifyCode: verifyCode, factorId: factorId }),
    });
    const data = await request.json();
    if (data.error) {
      setError("Doğrulama kodu hatalı");
      return;
    }
    setIsVerified(true);
    await refetch();
    closeRef.current.click();
    toast.success("Başarılı", {
      description: "İki faktörlü kimlik doğrulama başarıyla etkinleştirildi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
  };
  const { isPending, data, refetch } = useQuery({
    queryKey: ["mfa-factors"],
    queryFn: () => fetch("/api/auth/mfa/factors").then((res) => res.json()),
  });

  const onRemove = async () => {
    const request = await fetch("/api/auth/mfa/remove", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    if (data.error) {
      console.error(data.error);
      return;
    }
    await refetch();
    router.refresh();
    toast.success("Başarılı", {
      description: "İki faktörlü kimlik doğrulama başarıyla kaldırıldı.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
  };
  return (
    <div className="flex w-full flex-col gap-y-6 mb-6">
      <PageHeadline
        header={
          <FormattedMessage
            defaultMessage="İki Faktörlü Kimlik Doğrulama"
            id="Auth / Profile details / Personal data header"
          />
        }
        subheader={
          <FormattedMessage
            defaultMessage="Hesabınızda 2FA'yı etkinleştirin"
            id="Auth / Profile details / Personal data label"
          />
        }
      />
      <div className="flex flex-col items-start gap-y-1">
        {!isPending &&
          (data?.data?.totp[0]?.status !== "verified" ? (
            <>
              <FormattedMessage
                defaultMessage="Hesabınız iki faktörlü kimlik doğrulama kullanmıyor. Güvenliğiniz için 2FA'yı etkinleştirin."
                id="Auth / Two-factor / Not using two-factor auth"
              />
              <Dialog onOpenChange={(e) => onOpenDialog(e)}>
                <DialogTrigger asChild>
                  <Button type="submit" className="mt-1 w-full sm:w-fit">
                    <FormattedMessage
                      defaultMessage="2FA'yı Kur"
                      id="Auth / Two-factor / Setup button"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[300px] sm:max-w-[600px] max-h-[95vh] overflow-y-scroll">
                  <div className="grid gap-4 py-4">
                    <H1 className="text-lg lg:text-xl">
                      <FormattedMessage
                        defaultMessage="Google Authenticator Kurulumu"
                        id="Auth / Add Two-factor / Configuring authenticator"
                      />
                    </H1>
                    <Separator className="mb-2 mt-1" />
                    <ol className="flex list-none flex-col gap-2 pl-0">
                      <li className="text-sm">
                        <FormattedMessage
                          defaultMessage="Google Authenticator'ı (IOS - Android) veya Authy'yi (IOS - Android) indirin ve yükleyin."
                          id="Auth / Add Two-factor / Install authenticator app"
                        />
                      </li>
                      <li className="text-sm">
                        <FormattedMessage
                          defaultMessage={`Authenticator uygulamasını açın ve "+" simgesine dokunun veya tıklayın.`}
                          id="Auth / Add Two-factor / Click add icon"
                        />
                      </li>
                      <li className="text-sm">
                        <FormattedMessage
                          defaultMessage={`Bir barkodu tarayın (veya QR kodu)" seçeneğini seçin ve telefonun kamerasını bu barkodu tarayacak şekilde kullanın.`}
                          id="Auth / Add Two-factor / Use camera to scan qr code"
                        />
                      </li>
                    </ol>
                    <div>
                      <H4 className="mt-4 text-lg">
                        <FormattedMessage
                          defaultMessage="QR Kodu Tarayın"
                          id="Auth / Add Two-factor / Scan QR Code"
                        />
                      </H4>
                      <Separator className="mb-2 mt-1" />
                      <div className="flex justify-center p-4">
                        <img
                          src={factorData?.totp?.qr_code}
                          alt="qrcode url"
                          className="w-32 h-32 sm:h-64 sm:w-64"
                        />
                      </div>
                    </div>
                    <div>
                      <H4 className="mt-4 text-lg">
                        <FormattedMessage
                          defaultMessage="Veya Uygulamaya Kodu Girin"
                          id="Auth / Add Two-factor / Enter code in app"
                        />
                      </H4>
                      <Separator className="mb-2 mt-1" />
                      <Paragraph
                        firstChildMargin={false}
                        className="my-0 text-sm"
                      >
                        <H4 className="text-xs md:text-sm break-all">
                          SecretKey: <b>{factorData?.totp?.secret}</b>{" "}
                          <small>(Base32 encoded)</small>
                        </H4>
                      </Paragraph>
                    </div>
                    <div>
                      <H4 className="mt-4 text-lg">
                        <FormattedMessage
                          defaultMessage="Kodu Doğrula"
                          id="Auth / Add Two-factor / Verify Code"
                        />
                      </H4>
                      <Separator className="mb-2 mt-1" />
                      <Paragraph
                        firstChildMargin={false}
                        className="my-0 text-sm"
                      >
                        <FormattedMessage
                          defaultMessage="Kurulumu tamamlamak için doğrulama kodunu girin"
                          id="Auth / Add Two-factor / Verify code for changing the setting"
                        />
                        :
                      </Paragraph>
                    </div>
                  </div>
                  <form onSubmit={onSubmit} className="relative">
                    <Input
                      pattern="[0-9]*"
                      placeholder="Doğrulama Kodu"
                      maxLength={6}
                      autoFocus
                      autoComplete="off"
                      className="mb-8 w-full !max-w-full"
                      required
                      error={error}
                      onChange={(e) => setVerifyCode(e.target.value)}
                    />
                    <DialogFooter>
                      <div className="flex flex-row gap-4">
                        <DialogClose asChild>
                          <Button ref={closeRef} type="button">
                            <FormattedMessage
                              defaultMessage="İptal"
                              id="Auth / Add Two-factor / Close button"
                            />
                          </Button>
                        </DialogClose>
                        <Button onSubmit={(e) => onSubmit(e)} type="submit">
                          <FormattedMessage
                            defaultMessage="Doğrula & Aktive Et"
                            id="Auth / Add Two-factor / Verify & Activate button"
                          />
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <FormattedMessage
                defaultMessage="Hesabınız iki faktörlü kimlik doğrulama uygulaması tarafından korunmaktadır."
                id="Auth / Two-factor / Not using two-factor auth"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mt-3">
                    İki Faktörlü Kimlik Doğrulamasını Kaldır
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      İki faktörlü kimlik doğrulamasını kaldırmak istediğinize
                      emin misiniz?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <FormattedMessage
                        defaultMessage="İki faktörlü kimlik doğrulamasını kaldırmak hesabınızın
                    güvenliğini tehlikeye atabilir.
                    Daha sonra tekrar etkinleştirmek isterseniz, tekrar
                    etkinleştirebilirsiniz."
                        id="Auth / Two-factor / info"
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemove()}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      İki Faktörlü Kimlik Doğrulamasını Kaldır
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ))}
      </div>
    </div>
  );
}
