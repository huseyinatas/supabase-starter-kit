"use client";

import { FormattedMessage } from "react-intl";
import { PageHeadline } from "@/components/layout/PageHeadline";
import React from "react";

export default function PageHeader() {
  return (
    <PageHeadline
      header={
        <FormattedMessage
          defaultMessage="Kullanıcı Profili"
          id="Auth / Profile details / Personal data header"
        />
      }
      subheader={
        <FormattedMessage
          defaultMessage="Burada hesabınız hakkında daha fazla bilgi bulabilir ve düzenleyebilirsiniz"
          id="Auth / Profile details / Personal data label"
        />
      }
    />
  );
}
