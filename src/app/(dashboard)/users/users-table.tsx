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
import Image from "next/image";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { FormattedMessage } from "react-intl";
import { Paragraph } from "@/components/ui/typography";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersTable({ variant }: { variant: string }) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [user, setUser] = useState({} as any);
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(20);
  const { isPending, data, refetch } = useQuery({
    queryKey: ["users/all", page],
    queryFn: () =>
      fetch(
        "/api/auth/users/" + variant + "?page=" + page + "&items=" + items,
      ).then((res) => res.json()),
  });
  const onOpenChange = (user: any = null) => {
    setPasswordOpen(!passwordOpen);
    setPassword("");
    setUser(user || ({} as any));
  };
  const onOpenMfa = (user: any = null) => {
    setMfaOpen(!mfaOpen);
    setPassword("");
    setUser(user || ({} as any));
  };
  const onOpenDelete = (user: any = null) => {
    setDeleteOpen(!deleteOpen);
    setUser(user || ({} as any));
  };
  const onPasswordChange = async () => {
    const { error } = await fetch("/api/admin/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        newPassword: password,
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
      description: "Kullanıcının şifresi başarıyla değiştirildi.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    onOpenChange();
  };
  const removeMfa = async () => {
    const { error } = await fetch("/api/admin/user/mfa/remove", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    }).then((res) => res.json());
    if (error) {
      if (error == "no-factors") {
        toast.error("Hata", {
          description: "Kullanıcı zaten 2FA kullanmıyor!",
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
      description: "Kullanıcının 2FA'sı başarıyla sıfırlandı.",
      action: {
        label: "Kapat",
        onClick: () => false,
      },
    });
    onOpenMfa();
  };
  const userDelete = async () => {
    const { error } = await fetch("/api/admin/user/delete", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
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
      description: "Kullanıcı başarıyla silindi.",
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
        <CardTitle>Kullanıcılar</CardTitle>
        <CardDescription>
          Tüm kullanıcılarınızı burada yönetebilirsiniz.
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
              <TableHead>Nickname</TableHead>
              <TableHead>E-Posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Takım</TableHead>
              <TableHead>Oluşturan Kullanıcı</TableHead>
              <TableHead>Oluşturulma Zamanı</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.profile_photo || "https://github.com/shadcn.png"
                      }
                      alt={"@" + user?.display_name}
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-white ${
                      user?.status === "active"
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-red-600 hover:bg-red-800"
                    }`}
                  >
                    {user?.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {user?.display_name}
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.role?.description}</TableCell>
                <TableCell>{user?.organization?.name || "N/A"}</TableCell>
                <TableCell>{user?.team?.name || "N/A"}</TableCell>
                <TableCell>{user?.creator?.display_name || "N/A"}</TableCell>
                <TableCell>
                  {new Date(user?.created_at).toLocaleString("tr-TR", {
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
                      <DropdownMenuItem
                        onClick={() => onOpenChange(user)}
                        className="cursor-pointer mb-3"
                      >
                        Şifre Güncelle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenMfa(user)}
                        className="cursor-pointer mb-3"
                      >
                        2FA Sıfırla
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenDelete(user)}
                        className="mb-3 cursor-pointer bg-red-800 text-white hover:bg-red-700 focus:bg-red-700 focus:text-white"
                      >
                        Kullanıcıyı Sil
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
              <strong>{data?.meta?.total_count}</strong> Kullanıcıdan{" "}
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
      <AlertDialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user?.display_name} Şifresini Güncelle
            </AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Kullanıcı: {user}"
                  id="Auth / Profile details / user label"
                  values={{ user: user?.display_name }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="E-Posta: {email}"
                  id="Auth / Profile details / email label"
                  values={{ email: user?.email }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Rol: {role}"
                  id="Auth / Profile details / role label"
                  values={{ role: user?.role?.description }}
                />
              </Paragraph>
              <div>
                <Input
                  type="password"
                  placeholder="Yeni Şifreyi Giriniz"
                  className="mt-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button onClick={() => onPasswordChange()}>Onayla</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={mfaOpen} onOpenChange={setMfaOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user?.display_name} 2FA Sıfırla
            </AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Kullanıcı: {user}"
                  id="Auth / Profile details / user label"
                  values={{ user: user?.display_name }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="E-Posta: {email}"
                  id="Auth / Profile details / email label"
                  values={{ email: user?.email }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Rol: {role}"
                  id="Auth / Profile details / role label"
                  values={{ role: user?.role?.description }}
                />
              </Paragraph>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button variant="destructive" onClick={() => removeMfa()}>
              2 Adımlı Doğrulamayı Sıfırla
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user?.display_name} Kullanıcısını Sil
            </AlertDialogTitle>
            <AlertDialogDescription className="grid gap-y-2">
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Kullanıcı: {user}"
                  id="Auth / Profile details / user label"
                  values={{ user: user?.display_name }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="E-Posta: {email}"
                  id="Auth / Profile details / email label"
                  values={{ email: user?.email }}
                />
              </Paragraph>
              <Paragraph firstChildMargin={false}>
                <FormattedMessage
                  defaultMessage="Rol: {role}"
                  id="Auth / Profile details / role label"
                  values={{ role: user?.role?.description }}
                />
              </Paragraph>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button variant="destructive" onClick={() => userDelete()}>
              Kullanıcıyı Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
