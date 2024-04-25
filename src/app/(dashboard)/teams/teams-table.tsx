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

export default function TeamsTable({ variant }: { variant: string }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [team, setTeam] = useState({} as any);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(20);
  const { isPending, data, refetch } = useQuery({
    queryKey: ["teams/all" + variant, page],
    queryFn: () =>
      fetch("/api/teams/" + variant + "?page=" + page + "&items=" + items).then(
        (res) => res.json(),
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
  const onStatusChange = async () => {
    const { error } = await fetch("/api/teams/status/" + team?.id, {
      method: "POST",
      body: JSON.stringify({
        status: team?.status === "active" ? "inactive" : "active",
      }),
    }).then((res) => res.json());
    if (error) {
      if (error.code == "weak_password") {
        toast.error("Hata", {
          description: "Lütfen güvenli bir şifre giriniz!",
          action: {
            label: "Kapat",
            onClick: () => false,
          },
        });
        return;
      }
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
      description: "Takım durumu başarıyla güncellendi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    await refetch();
    onOpenStatus();
  };
  const teamDelete = async () => {
    const { error } = await fetch("/api/teams/delete/" + team?.id, {
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
      description: "Takım başarıyla silindi.",
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
        <CardTitle>Takımlar</CardTitle>
        <CardDescription>
          Tüm takımlarınızı burada yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-scroll">
        <Table className="whitespace-nowrap overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[100px]">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Takım Adı</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Komisyon</TableHead>
              <TableHead>Oluşturan Kullanıcı</TableHead>
              <TableHead>Oluşturulma Zamanı</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((team: any) => (
              <TableRow key={team.id}>
                <TableCell>
                  <Avatar className="rounded-none">
                    <AvatarImage
                      className="rounded-none"
                      src={team?.logo || "https://github.com/shadcn.png"}
                      alt={"@" + team?.display_name}
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-white ${
                      team?.status === "active"
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-red-600 hover:bg-red-800"
                    }`}
                  >
                    {team?.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{team?.name}</TableCell>
                <TableCell>{team?.organization?.name || "N/A"}</TableCell>
                <TableCell>{team?.definitions?.commission || "N/A"}</TableCell>
                <TableCell>{team?.creator?.display_name || "N/A"}</TableCell>
                <TableCell>
                  {new Date(team?.created_at).toLocaleString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
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
                      <DropdownMenuItem className="cursor-pointer mb-3">
                        <Link href={`/teams/update/${team.id}`}>
                          Takımı Güncelle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenStatus(team)}
                        className="cursor-pointer mb-3"
                      >
                        {team?.status == "active"
                          ? "Takımı Pasife Al"
                          : "Takımı Aktif Et"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenDelete(team)}
                        className="mb-3 cursor-pointer bg-red-800 text-white hover:bg-red-700 focus:bg-red-700 focus:text-white"
                      >
                        Takımı Sil
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
          <AlertDialogHeader>
            <AlertDialogTitle>
              {team?.name} Takımını{" "}
              {team?.status === "active" ? "Pasif" : "Aktif"}
              {`'e`} Al
            </AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Takım: {team}"
                  id="Auth / Profile details / user label"
                  values={{ team: team?.name }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Organizasyon: {organization}"
                  id="Auth / Profile details / email label"
                  values={{ organization: team?.organization?.name }}
                />
              </Paragraph>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button onClick={() => onStatusChange()}>Onayla</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{team?.name} Takımını Sil</AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Takım: {team}"
                  id="Auth / Profile details / user label"
                  values={{ team: team?.name }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Organizasyon: {organization}"
                  id="Auth / Profile details / email label"
                  values={{ organization: team?.organization?.name }}
                />
              </Paragraph>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button variant="destructive" onClick={() => teamDelete()}>
              Takımı Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
