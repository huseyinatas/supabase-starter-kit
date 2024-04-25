"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paragraph } from "@/components/ui/typography";
import { FormattedMessage } from "react-intl";
import { Database } from "@/lib/database.types";

export default function AvatarAndInformation({
  user,
}: Readonly<{ user: any }>) {
  return (
    <div className="flex flex-row gap-3 mt-6">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <Paragraph>
          <FormattedMessage
            defaultMessage="İsim: {displayName}"
            id="Auth / Profile details / Name label"
            values={{
              displayName: user?.user_metadata?.displayName,
            }}
          />
        </Paragraph>
        <Paragraph firstChildMargin={false}>
          <FormattedMessage
            defaultMessage="Email: {email}"
            id="Auth / Profile details / Email label"
            values={{ email: user?.email }}
          />
        </Paragraph>
      </div>
    </div>
  );
}
