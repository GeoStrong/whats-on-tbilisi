"use client";

import React from "react";
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

const SignupSuccessDialog: React.FC = () => {
  const { signupSuccessOpen } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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
        <div className="mt-4 flex justify-end">
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
