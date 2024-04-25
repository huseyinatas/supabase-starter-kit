"use client";
import React, { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

export type PageHeadlineProps = {
  hasBackButton?: boolean;
  header: ReactNode;
  subheader?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const PageHeadline = ({
  hasBackButton = false,
  header,
  subheader,
  ...props
}: PageHeadlineProps) => {
  return (
    <>
      <div className="mt-6" {...props}>
        <h3 className="text-lg font-medium">{header}</h3>

        {subheader && (
          <p className="text-muted-foreground text-sm">{subheader}</p>
        )}
      </div>
      <Separator className="mt-3" />
    </>
  );
};
