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
import { FileText, MoreHorizontal } from "lucide-react";
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

export default function PoliciesTable({ variant }: { variant: string }) {
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
    queryKey: ["policies/all" + variant, page],
    queryFn: () =>
      fetch("/api/policies" + "?page=" + page + "&items=" + items).then((res) =>
        res.json(),
      ),
  });

  const [isPdfLoading, setIsPdfLoading] = useState(false);
  function downloadPdf(base64Data: any, fileName: any) {
    const linkSource = `data:application/pdf;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const handlePDF = async (id: any) => {
    setIsPdfLoading(true);
    const req = await fetch(`/api/dask/pdf-sorgula/${id}`, {
      method: "POST",
    });
    const res = await req.json();
    downloadPdf(res?.data, id + ".pdf");
    setIsPdfLoading(false);
  };
  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="min-w-full overflow-x-scroll"
    >
      <CardHeader>
        <CardTitle>Poliçeler</CardTitle>
        <CardDescription>
          Aktif durumdaki poliçelerinizi buradan görebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-scroll">
        <Table className="whitespace-nowrap overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>Durum</TableHead>
              <TableHead>AK Sigorta Poliçe No</TableHead>
              <TableHead>Dask Poliçe No</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead>Başlangıç Tarihi</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Teminat Bilgisi</TableHead>
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
                      team?.status === "approved"
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-amber-400 hover:bg-amber-500"
                    }`}
                  >
                    {team?.status === "approved" ? "Onaylandı" : "Bekleniyor"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium ">{team?.policeNo}</TableCell>
                <TableCell>{team?.daskPoliceNo || "N/A"}</TableCell>
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
                  <Button onClick={() => handlePDF(team?.id)} size="sm">
                    <FileText />
                  </Button>
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
    </Card>
  );
}
