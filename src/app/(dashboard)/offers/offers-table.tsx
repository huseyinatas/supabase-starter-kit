"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormattedMessage } from "react-intl";
import { Paragraph } from "@/components/ui/typography";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type Inputs = {
  cardOwner: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  offerId: string;
};

export default function OffersTable({ variant }: { variant: string }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [team, setTeam] = useState({} as any);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(20);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const { isPending, data, refetch } = useQuery({
    queryKey: ["offers/all" + variant, page],
    queryFn: () =>
      fetch("/api/offers" + "?page=" + page + "&items=" + items).then((res) =>
        res.json(),
      ),
  });
  const onOpenStatus = (team: any = null) => {
    setStatusOpen(!statusOpen);
    setTeam(team || ({} as any));
  };
  const onOpenDelete = (user: any = null) => {
    setDeleteOpen(!deleteOpen);
    setTeam(user || ({} as any));
  };
  const onStatusChange = async (data: any) => {
    const req = await fetch("/api/dask/odeme-yap/" + team?.id, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await req.json();
    const payment_url = res.data?.sanalpos3dUrl[0];
    if (res.error) {
      toast.error("Hata", {
        description: "Bir hata oluştu!",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      return;
    }
    window.location.href = payment_url;
  };
  const teamDelete = async () => {
    const { error } = await fetch("/api/offers/delete/" + team?.id, {
      method: "POST",
    }).then((res) => res.json());
    if (error) {
      toast.error("Hata", {
        description: "Bir hata oluştu!",
        action: {
          label: "Kapat",
          onClick: () => false,
        },
      });
      return;
    }
    toast.success("Başarılı", {
      description: "Teklif başarıyla silindi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    await refetch();
    onOpenDelete();
  };
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="min-w-full overflow-x-scroll"
    >
      <CardHeader>
        <CardTitle>Teklifler</CardTitle>
        <CardDescription>
          Ödeme yapılmamış tekliflerinizi buradan yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-scroll">
        <Table className="whitespace-nowrap overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>Durum</TableHead>
              <TableHead>Geçici Poliçe No</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead>Başlangıç Tarihi</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Teminat Bilgisi</TableHead>
              <TableHead>Ödenecek Tutar</TableHead>
              <TableHead className="max-w-[100px]">
                <span className="sr-only">İşlemler</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((team: any) => (
              <TableRow key={team.id}>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-white ${
                      team?.status === "active"
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-amber-400 hover:bg-amber-500"
                    }`}
                  >
                    {team?.status === "approved" ? "Onaylandı" : "Bekleniyor"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium ">
                  {team?.policy_number}
                </TableCell>
                <TableCell>{team?.name_surname || "N/A"}</TableCell>
                <TableCell>{team?.address || "N/A"}</TableCell>
                <TableCell>{team?.start_date || "N/A"}</TableCell>
                <TableCell>{team?.end_date || "N/A"}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(team?.guarantee)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(team?.paid_amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-4 py-2" align="end">
                      <DropdownMenuLabel className="cursor-pointer mb-3">
                        İşlemler
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onOpenStatus(team)}
                        className="cursor-pointer mb-3"
                      >
                        Ödeme Yap
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenDelete(team)}
                        className="mb-3 cursor-pointer bg-red-800 text-white hover:bg-red-700 focus:bg-red-700 focus:text-white"
                      >
                        Teklifi Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        {isPending ? (
          <div className="text-xs text-muted-foreground">
            <strong>Yükleniyor...</strong>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center">
            <div className="text-xs text-muted-foreground">
              <strong>{data?.meta?.total_count}</strong> Takımdan{" "}
              <strong>
                {(data?.meta?.current_page - 1) * data?.meta?.items_count + 1}-
                {data?.meta?.current_page * data?.meta?.items_count}
              </strong>{" "}
              arası gösteriliyor.
            </div>
            <Pagination className="max-w-fit justify-end mx-0">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant={page === 0 ? "outline" : "default"}
                    disabled={data?.meta?.prev_page === null}
                    onClick={() => setPage(data?.meta?.prev_page)}
                  >
                    Önceki
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    onClick={() => setPage(data?.meta?.next_page)}
                    disabled={data?.meta?.next_page === null}
                    variant={
                      data?.meta?.next_page === null ? "outline" : "default"
                    }
                    lang="tr"
                  >
                    Sonraki
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardFooter>
      <AlertDialog open={statusOpen} onOpenChange={setStatusOpen}>
        <AlertDialogContent>
          <form
            className="grid gap-y-3"
            onSubmit={handleSubmit(onStatusChange)}
          >
            <AlertDialogHeader>
              <AlertDialogDescription className="grid gap-y-2">
                <Card>
                  <CardTitle className="p-3">Poliçe Detayları</CardTitle>
                  <CardContent className="p-3 grid gap-y-3">
                    <Paragraph firstChildMargin={false}>
                      <FormattedMessage
                        defaultMessage="Sigortalı: {name}"
                        id="Auth / Profile details / user label"
                        values={{ name: team?.name_surname }}
                      />
                    </Paragraph>
                    <hr />
                    <Paragraph firstChildMargin={false}>
                      <FormattedMessage
                        defaultMessage="Adres: {address}"
                        id="Auth / Profile details / email label"
                        values={{ address: team?.address }}
                      />
                    </Paragraph>
                    <hr />
                    <Paragraph firstChildMargin={false}>
                      <FormattedMessage
                        defaultMessage="Poliçe Başlangıç/Bitiş Tarihi: {start_date} - {end_date}"
                        id="Auth / Profile details / email label"
                        values={{
                          start_date: team?.start_date,
                          end_date: team?.end_date,
                        }}
                      />
                    </Paragraph>
                    <hr />
                    <Paragraph firstChildMargin={false}>
                      <FormattedMessage
                        defaultMessage="Teminat: {teminat}"
                        id="Auth / Profile details / email label"
                        values={{
                          teminat: new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(team?.guarantee),
                        }}
                      />
                    </Paragraph>
                    <hr />
                    <Paragraph firstChildMargin={false}>
                      <FormattedMessage
                        defaultMessage="Ödenecek Tutar: {tutar}"
                        id="Auth / Profile details / email label"
                        values={{
                          tutar: new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(team?.paid_amount),
                        }}
                      />
                    </Paragraph>
                  </CardContent>
                </Card>
                <Card>
                  <CardTitle className="p-3">Kredi Kartı Bilgileri</CardTitle>
                  <CardContent className="p-3 grid gap-y-3">
                    <div>
                      <Input
                        className="!max-w-full"
                        id="displayName"
                        label="Kart Sahibi"
                        type="text"
                        defaultValue={""}
                        error={""}
                        {...register("cardOwner")}
                      />
                    </div>
                    <div>
                      <Input
                        className="!max-w-full"
                        id="displayName"
                        label="Kart Numarası"
                        type="text"
                        defaultValue={""}
                        error={""}
                        {...register("cardNumber")}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-x-2">
                      <div>
                        <Input
                          className="!max-w-full"
                          id="displayName"
                          placeholder="AA"
                          label="Ay"
                          type="text"
                          defaultValue={""}
                          error={""}
                          {...register("cardMonth")}
                        />
                      </div>
                      <div>
                        <Input
                          className="!max-w-full"
                          id="displayName"
                          placeholder="YYYY"
                          label="Yıl"
                          type="text"
                          defaultValue={""}
                          error={""}
                          {...register("cardYear")}
                        />
                      </div>
                      <div>
                        <Input
                          className="!max-w-full"
                          id="displayName"
                          label="CVV"
                          type="text"
                          defaultValue={""}
                          error={""}
                          placeholder="CVV"
                          {...register("cardCvv")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <Button type="submit">Ödemeyi Onayla</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teklifi Sil</AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Teklifi silmek istediğinize emin misiniz?"
                  id="Auth / Profile details / user label"
                />
              </Paragraph>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button variant="destructive" onClick={() => teamDelete()}>
              Teklifi Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
