"use client";

import { FormattedMessage } from "react-intl";
import { PageHeadline } from "@/components/layout/PageHeadline";
import React from "react";

export default function PageHeader() {
  return (
    <PageHeadline
      header={
        <FormattedMessage
          defaultMessage="Kullanıcı Bilgileri"
          id="Auth / Profile details / Personal data header"
        />
      }
      subheader={
        <FormattedMessage
          defaultMessage="Eklemek istediğiniz kullanıcının bilgilerini tanımlayınız."
          id="Auth / Profile details / Personal data label"
        />
      }
    />
  );
}
