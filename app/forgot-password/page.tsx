"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth/auth";
import { Form, Formik, Field, ErrorMessage } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";

type ForgotStatus = "idle" | "loading" | "success" | "error";

const ForgotPasswordPage: React.FC = () => {
  const [status, setStatus] = useState<ForgotStatus>("idle");
  const [error, setError] = useState("");

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link if an account
          exists.
        </p>

        {status === "success" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              If an account exists for that email, we&apos;ve sent a password
              reset link.
            </p>
            <Link href="/">
              <Button className="w-full">Back to home</Button>
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
                    : "Something went wrong. Please try again.";
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
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
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
                  {status === "loading" ? "Sending..." : "Send reset link"}
                </Button>

                <Link href="/" className="block text-center text-sm underline">
                  Back to sign in
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
