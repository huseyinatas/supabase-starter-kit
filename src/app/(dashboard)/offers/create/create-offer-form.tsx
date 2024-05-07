"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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
import { PageHeadline } from "@/components/layout/PageHeadline";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CalendarPlus2,
  CalendarX,
  Check,
  CircleUser,
  FileText,
  Home,
  Info,
  SmilePlus,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
type Inputs = {
  tc: string;
  dogumTarihi: string;
  phone: string;
  uavt: {
    il: string;
    ilce: string;
    bucak_koy: string;
    mahalle: string;
    cadde: string;
    bina: string;
    daire: {
      daireNo: string;
      uavtAdresNo: string;
    };
  };
  yapiTarzi: string;
  yuzOlcumu: string;
  binaInsaYili: string;
  binaKatSayisi: string;
  daireKullanimSekli: string;
  sigortaliKati: string;
  sigortaEttirenSifati: string;
};

export default function CreateOfferForm() {
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
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [policy, setPolicy] = useState<any>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    const req = await fetch("/api/dask/teklif-olustur", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await req.json();
    if (res?.data?.errorCode[0] != "00") {
      alert(res?.data?.errorMessage);
      toast.error("Hata", {
        description: res?.data?.errorMessage,
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      return;
    }
    setSuccess(true);
    setPolicy(res?.data);
    toast.success("Başarılı", {
      description: "Teklif başarıyla oluşturuldu",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
  };

  const { data: il } = useQuery({
    queryKey: ["il"],
    queryFn: () => fetch("/api/uavt/il-sorgula").then((res) => res.json()),
  });

  const { data: ilce } = useQuery({
    queryKey: ["ilce", watch("uavt.il")],
    queryFn: () =>
      fetch("/api/uavt/ilce-sorgula/" + watch("uavt.il")).then((res) =>
        res.json(),
      ),
    enabled: !!watch("uavt.il"),
  });
  const { data: bucak_koy } = useQuery({
    queryKey: ["bucak-koy", watch("uavt.ilce"), watch("uavt.il")],
    queryFn: () =>
      fetch(
        "/api/uavt/bucak-koy-sorgula?ilKodu=" +
          watch("uavt.il") +
          "&ilceKodu=" +
          watch("uavt.ilce"),
      ).then((res) => res.json()),
    enabled: !!watch("uavt.ilce"),
  });

  const { data: mahalle } = useQuery({
    queryKey: [
      "mahalle",
      watch("uavt.ilce"),
      watch("uavt.il"),
      watch("uavt.bucak_koy"),
    ],
    queryFn: () =>
      fetch(
        "/api/uavt/mahalle-sorgula?bucakKoyKodu=" + watch("uavt.bucak_koy"),
      ).then((res) => res.json()),
    enabled: !!watch("uavt.bucak_koy"),
  });
  const { data: cadde } = useQuery({
    queryKey: [
      "cadde",
      watch("uavt.ilce"),
      watch("uavt.il"),
      watch("uavt.bucak_koy"),
      watch("uavt.mahalle"),
    ],
    queryFn: () =>
      fetch(
        "/api/uavt/cadde-sorgula?mahalleKodu=" + watch("uavt.mahalle"),
      ).then((res) => res.json()),
    enabled: !!watch("uavt.mahalle"),
  });
  const { data: bina } = useQuery({
    queryKey: [
      "cadde",
      watch("uavt.ilce"),
      watch("uavt.il"),
      watch("uavt.bucak_koy"),
      watch("uavt.mahalle"),
      watch("uavt.cadde"),
    ],
    queryFn: () =>
      fetch(
        "/api/uavt/bina-sorgula?caddeSokakKodu=" + watch("uavt.cadde"),
      ).then((res) => res.json()),
    enabled: !!watch("uavt.cadde"),
  });
  const { data: daire } = useQuery({
    queryKey: [
      "cadde",
      watch("uavt.ilce"),
      watch("uavt.il"),
      watch("uavt.bucak_koy"),
      watch("uavt.mahalle"),
      watch("uavt.cadde"),
      watch("uavt.bina"),
    ],
    queryFn: () =>
      fetch("/api/uavt/daire-sorgula?binaKodu=" + watch("uavt.bina")).then(
        (res) => res.json(),
      ),
    enabled: !!watch("uavt.bina"),
  });
  const selectDaire = (e: any) => {
    const [daireNo, uavtAdresNo] = e.split("-");
    setValue("uavt.daire.daireNo", daireNo);
    setValue("uavt.daire.uavtAdresNo", uavtAdresNo);
  };

  const handleFloorChange = (event: any) => {
    let parametreKodu;
    if (event >= 1 && event <= 3) {
      parametreKodu = "05";
    } else if (event >= 4 && event <= 7) {
      parametreKodu = "06";
    } else if (event >= 8 && event <= 18) {
      parametreKodu = "07";
    } else {
      parametreKodu = "08";
    }
    setValue("binaKatSayisi", parametreKodu);
  };
  return (
    <>
      {success ? (
        <>
          <Alert>
            <SmilePlus className="h-4 w-4" />
            <AlertTitle className="text-green-600">Başarılı!</AlertTitle>
            <AlertDescription>
              Poliçe teklifi başarıyla oluşturuldu.
            </AlertDescription>
            <AlertDescription className="font-bold">
              Teklif poliçe numaranız: {policy?.policeNo[0]}
            </AlertDescription>
          </Alert>
          <Card className={cn("w-full mt-3")}>
            <CardHeader>
              <CardTitle>Teklif Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <CircleUser />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Ad Soyad</p>
                  <p className="text-sm text-muted-foreground">
                    {policy?.adSoyad[0]}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <Home />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Adres</p>
                  <p className="text-sm text-muted-foreground">
                    {policy?.adres[0]}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <CalendarPlus2 />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Poliçe Başlama Tarihi
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {policy?.policeBaslamaTarihi[0]}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <CalendarX />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Poliçe Bitiş Tarihi
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {policy?.policeBitisTarihi[0]}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <FileText />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Teminat Bilgisi
                  </p>
                  <p className="text-sm text-muted-foreground font-bold">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(
                      policy?.teminatBilgileri[0].teminatBilgisi[0].bedel,
                    )}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <FileText />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Ödenecek Net Prim Tutarı
                  </p>
                  <p className="text-sm text-muted-foreground font-bold">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(
                      policy?.teminatBilgileri[0].teminatBilgisi[0].netPrim,
                    )}
                  </p>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none"></p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href="/offers" className="w-full flex items-center">
                  <Check className="mr-2 h-4 w-4" /> Teklifleri Görüntüle
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "flex flex-row flex-wrap items-end justify-center gap-4 md:max-w-full md:justify-start",
          )}
        >
          {step === 1 && (
            <>
              <div className="flex w-full flex-row flex-wrap gap-4 mt-5">
                <div className="w-full">
                  <Input
                    className="!max-w-full"
                    id="displayName"
                    label={intl.formatMessage({
                      defaultMessage: "Tapu Sahibi TC No veya Vergi No",
                      id: "Auth / Update profile / First name label",
                    })}
                    type="text"
                    maxLength={11}
                    defaultValue={""}
                    error={""}
                    {...register("tc", {
                      required: "TC veya Vergi numarası gereklidir.",
                      maxLength: {
                        value: 11,
                        message: "TC veya Vergi numarası 11 haneli olmalıdır.",
                      },
                      pattern: {
                        value: /^[1-9]{1}[0-9]{9}[02468]{1}$/,
                        message: "Geçerli bir TC veya Vergi numarası giriniz.",
                      },
                    })}
                  />
                  {errors.tc && (
                    <small className="text-red-500 text-xs">
                      {errors.tc.message}
                    </small>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    className="!max-w-full"
                    id="displayName"
                    label={intl.formatMessage({
                      defaultMessage: "Tapu Sahibi Doğum Tarihi",
                      id: "Auth / Update profile / First name label",
                    })}
                    type="date"
                    defaultValue={""}
                    error={""}
                    {...register("dogumTarihi", {
                      required: "Doğum tarihi gereklidir.",
                    })}
                  />
                  {errors.dogumTarihi && (
                    <small className="text-red-500 text-xs">
                      {errors.dogumTarihi.message}
                    </small>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    id="displayName"
                    className="!max-w-full"
                    label={intl.formatMessage({
                      defaultMessage: "Cep Telefonu",
                      id: "Auth / Update profile / Phone label",
                    })}
                    type="text"
                    defaultValue={""}
                    maxLength={11}
                    error={""}
                    {...register("phone", {
                      required: "Telefon numarası gereklidir.",
                      maxLength: {
                        value: 11,
                        message:
                          "Telefon numarası 0(5XX)XXX-XX-XX formatında olmalıdır.",
                      },
                      pattern: {
                        value: /^0(5\d{2})\d{3}\d{4}$/,
                        message:
                          "Geçerli bir Türkiye telefon numarası giriniz. Örnek: +905XXYYYZZZZ",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <small className="text-red-500 text-xs">
                    {errors.phone.message}
                  </small>
                )}
              </div>
              <Button
                className={`${isSubmitting && "opacity-90"}`}
                type="submit"
              >
                <FormattedMessage
                  defaultMessage="Devam Et"
                  id="Auth / Add Two-factor / Verify & Activate button"
                />
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex w-full flex-row flex-wrap gap-4 mt-5">
                <PageHeadline
                  className="-mt-6"
                  header={
                    <FormattedMessage
                      defaultMessage="Adres Bilgileri"
                      id="Auth / Profile details / Personal data header"
                    />
                  }
                  subheader={
                    <FormattedMessage
                      defaultMessage="İl, ilçe ve mahalle bilgisi doğru girilmelidir. Yanlış girilmesi durumunda, DASK sistemi gereği poliçede değişiklik yapılamamaktadır."
                      id="Auth / Profile details / Personal data label"
                    />
                  }
                />
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">İl Seçiniz</span>
                  </label>
                  <Select onValueChange={(e) => setValue("uavt.il", e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="İl Seçiniz">
                        {(watch("uavt.il") &&
                          il?.data?.ilBilgisi?.find(
                            (ilData: any) => ilData.ilKodu == watch("uavt.il"),
                          )?.ilAdi) ||
                          "İl Seçiniz"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        {il?.data?.ilBilgisi?.map((ilData: any) => (
                          <SelectItem key={ilData.ilKodu} value={ilData.ilKodu}>
                            {ilData?.ilAdi}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {watch("uavt.il") && (
                  <div className="relative w-full">
                    <label htmlFor="ilce" className="order-first mb-1 text-xs">
                      <span className="order-first mb-1 text-xs">
                        İlçe Seçiniz
                      </span>
                    </label>
                    <Select onValueChange={(e) => setValue("uavt.ilce", e)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="İlçe Seçiniz">
                          {(watch("uavt.il") &&
                            ilce?.data?.ilceBilgisi?.find(
                              (ilceData: any) =>
                                ilceData.ilceKodu == watch("uavt.ilce"),
                            )?.ilceAdi) ||
                            "İlçe Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="il" className="!w-full">
                        <SelectGroup>
                          {ilce?.data?.ilceBilgisi?.map((ilceData: any) => (
                            <SelectItem
                              key={ilceData.ilKodu}
                              value={ilceData.ilceKodu}
                            >
                              {ilceData?.ilceAdi}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.ilce") && (
                  <div className="relative w-full">
                    <label htmlFor="ilce" className="order-first mb-1 text-xs">
                      <span className="order-first mb-1 text-xs">
                        Bucak/Koy Seçiniz
                      </span>
                    </label>
                    <Select
                      disabled={!watch("uavt.ilce")}
                      onValueChange={(e) => setValue("uavt.bucak_koy", e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bucak/Koy Seçiniz Seçiniz">
                          {(watch("uavt.ilce") &&
                            bucak_koy?.data?.bucakKoyBilgisi?.find(
                              (bucakKoyData: any) =>
                                bucakKoyData.bucakKoyKodu ==
                                watch("uavt.bucak_koy"),
                            )?.bucakKoyAdi) ||
                            "Bucak/Koy Seçiniz Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="il" className="!w-full">
                        <SelectGroup>
                          {bucak_koy?.data?.bucakKoyBilgisi?.map(
                            (bucakKoyData: any) => (
                              <SelectItem
                                key={bucakKoyData.bucakKoyKodu}
                                value={bucakKoyData.bucakKoyKodu}
                              >
                                {bucakKoyData?.bucakKoyAdi}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.bucak_koy") && (
                  <div className="relative w-full">
                    <label htmlFor="ilce" className="order-first mb-1 text-xs">
                      <span className="order-first mb-1 text-xs">
                        Mahalle Seçiniz
                      </span>
                    </label>
                    <Select
                      disabled={!watch("uavt.bucak_koy")}
                      onValueChange={(e) => setValue("uavt.mahalle", e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Mahalle Seçiniz">
                          {(watch("uavt.mahalle") &&
                            mahalle?.data?.mahalleBilgisi?.find(
                              (mahalleData: any) =>
                                mahalleData.mahalleKodu ==
                                watch("uavt.mahalle"),
                            )?.mahalleAdi) ||
                            "Mahalle Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="il" className="!w-full">
                        <SelectGroup>
                          {mahalle?.data?.mahalleBilgisi?.map(
                            (mahalleData: any) => (
                              <SelectItem
                                key={mahalleData.mahalleKodu}
                                value={mahalleData.mahalleKodu}
                              >
                                {mahalleData?.mahalleAdi}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.mahalle") && (
                  <div className="relative w-full">
                    <label
                      htmlFor="mahalle"
                      className="order-first mb-1 text-xs"
                    >
                      <span className="order-first mb-1 text-xs">
                        Cadde Seçiniz
                      </span>
                    </label>
                    <Select
                      disabled={!watch("uavt.mahalle")}
                      onValueChange={(e) => setValue("uavt.cadde", e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cadde Sokak Seçiniz">
                          {(watch("uavt.cadde") &&
                            cadde?.data?.caddeSokakBilgisi?.find(
                              (caddeData: any) =>
                                caddeData.caddeSokakKodu == watch("uavt.cadde"),
                            )?.caddeSokakAdi) ||
                            "Cadde Sokak Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="cadde" className="!w-full">
                        <SelectGroup>
                          {cadde?.data?.caddeSokakBilgisi?.map(
                            (caddeData: any) => (
                              <SelectItem
                                key={caddeData.caddeSokakKodu}
                                value={caddeData.caddeSokakKodu}
                              >
                                {caddeData?.caddeSokakAdi}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.cadde") && (
                  <div className="relative w-full">
                    <label
                      htmlFor="mahalle"
                      className="order-first mb-1 text-xs"
                    >
                      <span className="order-first mb-1 text-xs">
                        Bina Seçiniz
                      </span>
                    </label>
                    <Select
                      disabled={!watch("uavt.cadde")}
                      onValueChange={(e) => setValue("uavt.bina", e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bina Seçiniz">
                          {(watch("uavt.bina") &&
                            bina?.data?.binaBilgisi?.find(
                              (binaData: any) =>
                                binaData.binaKodu == watch("uavt.bina"),
                            )?.binaNo) ||
                            "Bina Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="cadde" className="!w-full">
                        <SelectGroup>
                          {bina?.data?.binaBilgisi?.map((binaData: any) => (
                            <SelectItem
                              key={binaData.binaKodu}
                              value={binaData.binaKodu}
                            >
                              {binaData?.binaNo}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.bina") && (
                  <div className="relative w-full">
                    <label
                      htmlFor="mahalle"
                      className="order-first mb-1 text-xs"
                    >
                      <span className="order-first mb-1 text-xs">
                        Daire Seçiniz
                      </span>
                    </label>
                    <Select
                      disabled={!watch("uavt.bina")}
                      onValueChange={(e) => selectDaire(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Daire Seçiniz">
                          {(watch("uavt.daire") &&
                            daire?.data?.daireBilgisi?.find(
                              (daireData: any) =>
                                daireData.daireNo ==
                                watch("uavt.daire.daireNo"),
                            )?.daireNo) ||
                            "Daire Seçiniz"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent id="cadde" className="!w-full">
                        <SelectGroup>
                          {daire?.data?.daireBilgisi?.map((daireData: any) => (
                            <SelectItem
                              key={
                                daireData.daireNo + "-" + daireData.uavtAdresNo
                              }
                              value={
                                daireData.daireNo + "-" + daireData.uavtAdresNo
                              }
                            >
                              {daireData?.daireNo}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {watch("uavt.daire.uavtAdresNo") && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>UAVT KODUNUZ</AlertTitle>
                    <AlertDescription>
                      {watch("uavt.daire.uavtAdresNo")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {watch("uavt.daire.uavtAdresNo") && (
                <Button
                  className={`${isSubmitting && "opacity-90"}`}
                  type="submit"
                >
                  <FormattedMessage
                    defaultMessage="Devam Et"
                    id="Auth / Add Two-factor / Verify & Activate button"
                  />
                </Button>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div className="flex w-full flex-row flex-wrap gap-4 mt-5">
                <PageHeadline
                  className="-mt-6"
                  header={
                    <FormattedMessage
                      defaultMessage="Konut Bilgileri"
                      id="Auth / Profile details / Personal data header"
                    />
                  }
                />
                <div className="w-full">
                  <Input
                    className="!max-w-full"
                    id="displayName"
                    label={intl.formatMessage({
                      defaultMessage: "Daire Yüz Ölçümü (Brüt m2)",
                      id: "1",
                    })}
                    type="text"
                    defaultValue={""}
                    error={""}
                    {...register("yuzOlcumu", {
                      required: "Daire yüz ölçümü gereklidir.",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Geçerli bir yüz ölçümü giriniz.",
                      },
                    })}
                  />
                  {errors.yuzOlcumu && (
                    <small className="text-red-500 text-xs">
                      {errors.yuzOlcumu.message}
                    </small>
                  )}
                </div>
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">
                      Bina Yapı Tarzı
                    </span>
                  </label>
                  <Select onValueChange={(e) => setValue("yapiTarzi", e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Yapı Tarzı Seçiniz"></SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        <SelectItem key={4} value={"4"}>
                          Çelik, Betonarme, Karkas Yapılar
                        </SelectItem>
                        <SelectItem key={5} value={"5"}>
                          Diğer
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">Bina Yaşı</span>
                  </label>
                  <Select onValueChange={(e) => setValue("binaInsaYili", e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Bina Yaşını Seçiniz"></SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        <SelectItem key={6} value={"6"}>
                          1975 ve Öncesi
                        </SelectItem>
                        <SelectItem key={7} value={"7"}>
                          1976 ile 1999 arası
                        </SelectItem>
                        <SelectItem key={8} value={"8"}>
                          2000 ile 2006 arası
                        </SelectItem>
                        <SelectItem key={9} value={"9"}>
                          2007 ile 2018 arası
                        </SelectItem>
                        <SelectItem key={10} value={"10"}>
                          2019 ve Sonrası
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">
                      Bina Kat Sayısı
                    </span>
                  </label>
                  <Select onValueChange={(e) => handleFloorChange(e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Bina Kat Sayısını Seçiniz"></SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (item) => (
                            <SelectItem key={item} value={item.toString()}>
                              {item}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">
                      Dairenin Bulunduğu Kat
                    </span>
                  </label>
                  <Select onValueChange={(e) => setValue("sigortaliKati", e)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dairenin Bulunduğu Katı Seçiniz"></SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        {Array.from(
                          { length: Number(watch("binaKatSayisi")) || 1 },
                          (_, i) => i + 1,
                        ).map((item) => (
                          <SelectItem key={item} value={item.toString()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <label htmlFor="il" className="order-first mb-1 text-xs">
                    <span className="order-first mb-1 text-xs">
                      Dairenin Kullanım Şekli
                    </span>
                  </label>
                  <Select
                    onValueChange={(e) => setValue("daireKullanimSekli", e)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dairenin Kullanım Şeklini Seçiniz"></SelectValue>
                    </SelectTrigger>
                    <SelectContent id="il" className="!w-full">
                      <SelectGroup>
                        <SelectItem key={5} value={"5"}>
                          Mesken
                        </SelectItem>
                        <SelectItem key={6} value={"6"}>
                          Ticarethane
                        </SelectItem>
                        <SelectItem key={7} value={"7"}>
                          Diğer
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className={`${isSubmitting && "opacity-90"}`}
                  type="submit"
                >
                  <FormattedMessage
                    defaultMessage={
                      isSubmitting ? "Lütfen bekleyin..." : "Teklif Oluştur"
                    }
                    id="Auth / Add Two-factor / Verify & Activate button"
                  />
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </>
  );
}
