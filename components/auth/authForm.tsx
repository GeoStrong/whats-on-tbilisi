"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { sendVerificationEmail, signIn, signUp } from "@/lib/auth/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const [isSignin, setIsSignin] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation(["auth", "validation", "errors"]);

  const SignSchema = Yup.object().shape({
    fullName: isSignin
      ? Yup.string().notRequired()
      : Yup.string()
          .min(2, t("validation:tooShort"))
          .required(t("validation:required")),
    email: Yup.string()
      .email(t("validation:invalidEmail"))
      .required(t("validation:required")),
    password: isSignin
      ? Yup.string()
      : Yup.string()
          .min(6, t("validation:minChars", { count: 6 }))
          .required(t("validation:required")),
  });

  const handleSubmit = async (
    values: { fullName: string; email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError("");
    try {
      if (isSignin) {
        await signIn(values.email, values.password);
        window.location.reload();
      } else {
        await signUp(values.email, values.password, values.fullName);
        try {
          await sendVerificationEmail();
        } catch (emailError: unknown) {
          const message =
            emailError instanceof Error
              ? emailError.message
              : t("errors:verificationEmailFailed");
          toast.error(message);
        }
        onOpenChange(false);
        dispatch(authActions.setSignupSuccessOpen(true));
        return;
      }

      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(t("errors:unexpectedError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("auth:dialog.welcomeTitle")}</DialogTitle>
            <DialogDescription>
              {isSignin
                ? t("auth:dialog.signInDescription")
                : t("auth:dialog.signUpDescription")}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" onClick={() => setIsSignin(true)}>
                {t("auth:dialog.signInTab")}
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsSignin(false)}>
                {t("auth:dialog.signUpTab")}
              </TabsTrigger>
            </TabsList>

            <Formik
              initialValues={{
                fullName: "",
                email: "",
                password: "",
              }}
              validationSchema={SignSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="mt-4 space-y-4">
                  {!isSignin && (
                    <div className="space-y-1">
                      <Label htmlFor="fullName">{t("auth:fields.fullName")}</Label>
                      <Field
                        name="fullName"
                        as={Input}
                        placeholder={t("auth:placeholders.fullName")}
                        id="fullName"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="email">{t("auth:fields.email")}</Label>
                    <Field
                      name="email"
                      as={Input}
                      type="email"
                      placeholder={t("auth:placeholders.email")}
                      id="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password">{t("auth:fields.password")}</Label>
                    <Field
                      name="password"
                      as={Input}
                      type="password"
                      placeholder={t("auth:placeholders.password")}
                      id="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="flex justify-end">
                    {isSignin && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary/80"
                        onClick={() => {
                          onOpenChange(false);
                          router.push("/forgot-password");
                        }}
                      >
                        {t("auth:dialog.forgotPassword")}
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  >
                    {isSubmitting
                      ? isSignin
                        ? t("auth:buttons.signingIn")
                        : t("auth:buttons.creatingAccount")
                      : isSignin
                        ? t("auth:buttons.signIn")
                        : t("auth:buttons.signUp")}
                  </Button>
                </Form>
              )}
            </Formik>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthDialog;
