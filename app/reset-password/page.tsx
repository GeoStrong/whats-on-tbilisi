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
import { useTranslation } from "react-i18next";

type ResetStatus = "idle" | "submitting" | "success" | "error";

const ResetPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [error, setError] = useState("");
  const { t } = useTranslation(["auth", "validation", "errors", "common"]);

  const token = useMemo(() => searchParams?.get("token") || "", [searchParams]);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, t("validation:passwordMin", { count: 8 }))
      .required(t("validation:required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("validation:passwordsMustMatch"))
      .required(t("validation:required")),
  });

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{t("auth:resetPassword.title")}</h1>
          <p className="mt-3 text-sm text-red-600">
            {t("auth:resetPassword.invalidLink")}
          </p>
          <Link href="/forgot-password" className="mt-4 block">
            <Button className="w-full">{t("auth:buttons.requestNewLink")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          {t("auth:resetPassword.setNewPasswordTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:resetPassword.tokenValidForLimitedTime")}
        </p>

        {status === "success" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {t("auth:resetPassword.success")}
            </p>
            <Button
              className="w-full"
              onClick={() => {
                router.push("/");
              }}
            >
              {t("auth:buttons.continueToSignIn")}
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
                    response?.message || t("errors:unableResetPassword"),
                  );
                }

                setStatus("success");
                toast.success(t("auth:resetPassword.success"));
              } catch (submitError: unknown) {
                const message =
                  submitError instanceof Error
                    ? submitError.message
                    : t("errors:invalidOrExpiredResetLink");
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
                  <Label htmlFor="password">{t("auth:fields.newPassword")}</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t("auth:placeholders.password")}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">
                    {t("auth:fields.confirmPassword")}
                  </Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={t("auth:placeholders.password")}
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
                    ? t("auth:buttons.updatingPassword")
                    : t("auth:buttons.updatePassword")}
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
  <ResetPasswordLoadingFallbackContent />
);

const ResetPasswordLoadingFallbackContent: React.FC = () => {
  const { t } = useTranslation(["auth", "common"]);

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">
          {t("auth:resetPassword.setNewPasswordTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common:actions.loading")}
        </p>
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
