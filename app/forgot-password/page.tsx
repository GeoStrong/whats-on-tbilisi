"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth/auth";
import { Form, Formik, Field, ErrorMessage } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

type ForgotStatus = "idle" | "loading" | "success" | "error";

const ForgotPasswordPage: React.FC = () => {
  const [status, setStatus] = useState<ForgotStatus>("idle");
  const [error, setError] = useState("");
  const { t } = useTranslation(["auth", "validation", "errors", "common"]);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validation:invalidEmail"))
      .required(t("validation:required")),
  });

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{t("auth:forgotPassword.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:forgotPassword.description")}
        </p>

        {status === "success" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {t("auth:forgotPassword.success")}
            </p>
            <Link href="/">
              <Button className="w-full">{t("common:actions.backToHome")}</Button>
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setStatus("loading");
              setError("");

              try {
                await requestPasswordReset(values.email);
                setStatus("success");
              } catch (submitError: unknown) {
                const message =
                  submitError instanceof Error
                    ? submitError.message
                    : t("errors:genericTryAgain");
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
                  <Label htmlFor="email">{t("auth:fields.email")}</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("auth:placeholders.email")}
                  />
                  <ErrorMessage
                    name="email"
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
                  disabled={isSubmitting || status === "loading"}
                >
                  {status === "loading"
                    ? t("common:actions.loading")
                    : t("auth:buttons.sendResetLink")}
                </Button>

                <Link href="/" className="block text-center text-sm underline">
                  {t("auth:forgotPassword.backToSignIn")}
                </Link>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
