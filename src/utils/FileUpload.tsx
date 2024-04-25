"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormattedMessage } from "react-intl";

export default function FileUploader({ watch, setValue }: any) {
  const supabase = createClientComponentClient();

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      const fileExtension = file.name.split(".").pop();
      const randomName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

      const { data, error } = (await supabase.storage
        .from("uploads")
        .upload(`${randomName}`, file, {
          cacheControl: "3600",
          upsert: false,
        })) as any;
      setValue("logo", process.env.NEXT_PUBLIC_STORAGE_URL + "/" + data?.path);
    },
    [setValue, supabase.storage],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <small>
        {watch("logo") ? (
          <div className="flex flex-row items-center justify-center gap-2">
            <img src={watch("logo")} alt="logo" className="w-24 h-auto " />
            <button
              type="button"
              onClick={() => setValue("logo", null)}
              className="text-red-500"
            >
              <FormattedMessage
                defaultMessage="Sil"
                id="Auth / Update profile / Dropzone remove button"
              />
            </button>
          </div>
        ) : (
          <FormattedMessage
            defaultMessage="Sürükleyip bırakarak veya tıklayarak takım logosu yükleyin"
            id="Auth / Update profile / Dropzone placeholder"
          />
        )}
      </small>
    </div>
  );
}
