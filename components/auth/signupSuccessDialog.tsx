"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { authActions } from "@/lib/store/authSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/auth/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const SignupSuccessDialog: React.FC = () => {
  const { signupSuccessOpen } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation(["auth"]);

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

  return (
    <Dialog
      open={signupSuccessOpen}
      onOpenChange={(open) => dispatch(authActions.setSignupSuccessOpen(open))}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("auth:dialog:checkEmailTitle")}</DialogTitle>
          <DialogDescription>
            {t("auth:dialog:checkEmailDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handleResend} disabled={isSending}>
            {isSending ? "Sending..." : t("auth:buttons:resendEmail")}
          </Button>
          <Button
            onClick={() => dispatch(authActions.setSignupSuccessOpen(false))}
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessDialog;
