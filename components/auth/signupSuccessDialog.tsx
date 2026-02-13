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

const SignupSuccessDialog: React.FC = () => {
  const { signupSuccessOpen } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);

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
          <DialogTitle>Check your email</DialogTitle>
          <DialogDescription>
            Thanks for signing up! We sent a verification email — please click
            the link in that email to verify your account, then return to log
            in.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Resend email"}
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
