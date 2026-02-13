"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Button } from "@/components/ui/button";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

const VerifyEmailContent: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get?.("token");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const hasRequestedRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;

      setStatus("verifying");
      const { data, error } = await supabase.functions.invoke("verify-email", {
        body: { token },
      });

      if (!isMountedRef.current) return;

      if (error || !data?.ok) {
        setStatus("error");
        setMessage(
          error?.message ||
            data?.message ||
            "Verification failed. The link may be expired.",
        );
        return;
      }

      setStatus("success");
      setMessage(
        "Your email has been verified. You can use your account now. ",
      );
    };

    verify();
  }, [token]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Email Verification</h1>
      {status === "verifying" && (
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      )}
      {status === "success" && (
        <p className="text-sm text-emerald-700">{message}</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{message}</p>}
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
};

const VerifyEmailLoadingFallback: React.FC = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
    <h1 className="text-2xl font-semibold">Email Verification</h1>
    <p className="text-sm text-muted-foreground">Loading…</p>
  </div>
);

const VerifyEmailPage: React.FC = () => {
  return (
    <Suspense fallback={<VerifyEmailLoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
