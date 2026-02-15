"use client";

import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface HeroImageUploadProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
}

const HeroImageUpload: React.FC<HeroImageUploadProps> = ({
  onChange,
  previewUrl,
  onPreviewChange,
}) => {
  const { t } = useTranslation(["create-activity"]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
        onPreviewChange(URL.createObjectURL(file));
      }
    },
    [onChange, onPreviewChange],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    noClick: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    onPreviewChange(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5"
            : previewUrl
              ? "border-transparent"
              : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-primary dark:hover:bg-gray-700"
        }`}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative min-h-[300px] w-full overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt="Hero preview"
              fill
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                >
                  {t("create-activity:heroImage.change")}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <FaTimes className="mr-1" />{" "}
                  {t("create-activity:heroImage.remove")}
                </Button>
              </div>
            </div>
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-transform hover:scale-110"
              onClick={handleRemoveImage}
            >
              <FaTimes size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <FaCloudUploadAlt className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {t("create-activity:heroImage.heading")}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("create-activity:heroImage.description")}
              </p>
              <p className="mt-1 text-xs text-primary">
                {t("create-activity:heroImage.recommendation")}
              </p>
            </div>
            <Button
              type="button"
              className="mt-2 bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              {t("create-activity:heroImage.browse")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImageUpload;
