"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const VerificationDialog: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams?.get?.("code");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (code) {
      setOpen(true);
    }
  }, [code]);

  const handleClose = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    router.replace(url.pathname + url.search);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account verified</DialogTitle>
          <DialogDescription>
            Your account has been verified successfully — you can now log in.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleClose}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VerificationDialogWrapper: React.FC = () => (
  <Suspense fallback={<></>}>
    <VerificationDialog />
  </Suspense>
);

export default VerificationDialogWrapper;
