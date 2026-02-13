"use client";

import React, { useMemo, useState } from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/auth/auth";
import { toast } from "sonner";
import { useLocation } from "react-use";

const VerifyEmailBanner: React.FC = () => {
  const { user, isAuthenticated } = useGetUserProfile();
  const [isSending, setIsSending] = useState(false);
  const location = useLocation();

  const needsVerification = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return !user.email_verified_at;
  }, [isAuthenticated, user]);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Couldn't resend the verification email.";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  if (!needsVerification) return null;

  if (location.pathname?.includes("auth/verify")) return null;

  return (
    <div className="border-b bg-amber-50 px-4 py-3 text-amber-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          Your account isn&apos;t verified yet. Some actions are read-only until
          you verify your email.
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleResend}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Resend verification"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailBanner;
