"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SmilePlus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function page({ params }: { params: { slug: string } }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  const handlePDF = async () => {
    setIsPdfLoading(true);
    const req = await fetch(`/api/dask/pdf-sorgula/${params.slug}`, {
      method: "POST",
    });
    const res = await req.json();
    downloadPdf(res?.data, params.slug + ".pdf");
    setIsPdfLoading(false);
  };
  return (
    <>
      <Alert className="grid gap-y-3">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle className="text-red-600">HATA!</AlertTitle>
        <AlertDescription>
          Poliçe oluştururken bir hata oluştu. Tekliflere dönüp tekrar deneyin
        </AlertDescription>
        <AlertDescription className="font-bold">
          <Button className="max-w-2xl">
            <Link href="/offers">Tekliflere Dön</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </>
  );
}
