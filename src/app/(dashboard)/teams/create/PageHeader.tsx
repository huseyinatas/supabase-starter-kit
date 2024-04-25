"use client";

import { FormattedMessage } from "react-intl";
import { PageHeadline } from "@/components/layout/PageHeadline";
import React from "react";

export default function PageHeader() {
  return (
    <PageHeadline
      header={
        <FormattedMessage
          defaultMessage="Takım Bilgileri"
          id="Auth / Profile details / Personal data header"
        />
      }
      subheader={
        <FormattedMessage
          defaultMessage="Eklemek istediğiniz takımın bilgilerini tanımlayınız."
          id="Auth / Profile details / Personal data label"
        />
      }
    />
  );
}
