"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordWithToken } from "@/lib/auth/auth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

type ResetStatus = "idle" | "submitting" | "success" | "error";

const ResetPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [error, setError] = useState("");

  const token = useMemo(() => searchParams?.get("token") || "", [searchParams]);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="mt-3 text-sm text-red-600">
            Invalid reset link. Please request a new password reset.
          </p>
          <Link href="/forgot-password" className="mt-4 block">
            <Button className="w-full">Request new link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your reset link is valid for a limited time.
        </p>

        {status === "success" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Password updated successfully. You can now sign in with your new
              password.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                router.push("/");
              }}
            >
              Continue to sign in
            </Button>
          </div>
        ) : (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={ResetPasswordSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setStatus("submitting");
              setError("");

              try {
                const response = await resetPasswordWithToken(
                  token,
                  values.password,
                  values.confirmPassword,
                );

                if (!response?.ok) {
                  throw new Error(
                    response?.message || "Unable to reset password.",
                  );
                }

                setStatus("success");
                toast.success("Password reset successful");
              } catch (submitError: unknown) {
                const message =
                  submitError instanceof Error
                    ? submitError.message
                    : "Invalid or expired reset link.";
                setError(message);
                setStatus("error");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-5 space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="password">New password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {status === "error" && error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || status === "submitting"}
                >
                  {status === "submitting"
                    ? "Updating password..."
                    : "Update password"}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const ResetPasswordLoadingFallback: React.FC = () => (
  <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
    </div>
  </div>
);

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
