import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { UserProfile } from "@/lib/types";
import { Button } from "../ui/button";
import { changePassword, signOut } from "@/lib/auth/auth";
import { useDispatch } from "react-redux";
import { userActions } from "@/lib/store/userSlice";
import { AppDispatch } from "@/lib/store/store";
import { handleUploadUserInformation } from "@/lib/profile/profile";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";

interface ProfileAccountProps {
  user: UserProfile | null;
}

interface FormValues {
  name: string;
  phone: string;
  bio: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileAccount: React.FC<ProfileAccountProps> = ({ user }) => {
  const { t } = useTranslation(["profile"]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("profile:account.nameMinLength"))
      .max(30, t("profile:account.nameMaxLength"))
      .required(t("profile:account.nameRequired")),
    phone: Yup.string()
      .max(20, t("profile:account.phoneMaxLength"))
      .nullable(),
    bio: Yup.string()
      .max(100, t("profile:account.bioMaxLength"))
      .nullable(),
  });

  const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(
      t("profile:account.currentPasswordRequired")
    ),
    newPassword: Yup.string()
      .min(8, t("profile:account.newPasswordMinLength"))
      .required(t("profile:account.newPasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("profile:account.passwordsNotMatch"))
      .required(t("profile:account.confirmPasswordRequired")),
  });

  if (!user) {
    return null;
  }

  const initialValues: FormValues = {
    name: user.name || "",
    phone: user.phone || "",
    bio: user.additionalInfo || "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    if (!user?.email_verified_at) {
      toast.error(t("profile:account.emailVerificationRequired"));
      setSubmitting(false);
      return;
    }

    try {
      await handleUploadUserInformation(
        user,
        values.name,
        values.phone,
        values.bio,
      );
      toast.success(t("profile:account.profileUpdated"));
      setIsEditing(false);
    } catch (error) {
      logger.error("Failed to update profile", error);
      toast.error(t("profile:account.updateFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(userActions.logout());
      return redirect("/");
    } catch (error) {
      logger.error("Failed to logout", error);
      // toast.error("Failed to logout. Please try again.");
      return redirect("/");
    }
  };

  const handlePasswordSubmit = async (
    values: PasswordFormValues,
    {
      setSubmitting,
      resetForm,
      setFieldError,
    }: FormikHelpers<PasswordFormValues>,
  ) => {
    if (!user?.email_verified_at) {
      toast.error(t("profile:account.emailVerificationRequired"));
      setSubmitting(false);
      return;
    }

    try {
      await changePassword(
        user.email,
        values.currentPassword,
        values.newPassword,
      );
      toast.success(t("profile:account.passwordChangeSuccess"));
      resetForm();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      logger.error("Failed to change password", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("profile:account.passwordChangeFailed");

      if (errorMessage.toLowerCase().includes("new password")) {
        setFieldError("newPassword", errorMessage);
      } else {
        setFieldError("currentPassword", errorMessage);
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, dirty, isValid, resetForm }) => (
          <Form noValidate>
            <Card className="border-none shadow-none hover:shadow-none dark:bg-gray-800">
              <CardHeader className="flex w-full flex-col justify-between md:flex-row">
                <div>
                  <CardTitle className="text-lg">
                    {t("profile:account.profileInformation")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("profile:account.profileDescription")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          resetForm();
                        }}
                        disabled={isSubmitting}
                      >
                        {t("profile:account.cancel")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={!dirty || !isValid || isSubmitting}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting
                          ? t("profile:account.saving")
                          : t("profile:account.saveChanges")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      {t("profile:account.editProfile")}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="profile-name">
                    {t("profile:account.name")}
                  </Label>
                  <Field
                    as={Input}
                    id="profile-name"
                    name="name"
                    type="text"
                    readOnly={!isEditing}
                    placeholder={t("profile:account.namePlaceholder")}
                    className="p-5 dark:border-gray-500"
                    aria-invalid={false}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Email (readonly) */}
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="profile-email">
                    {t("profile:account.email")}
                  </Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="p-5 dark:border-gray-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="profile-phone">
                    {t("profile:account.phone")}
                  </Label>
                  <Field
                    as={Input}
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    readOnly={!isEditing}
                    placeholder={t("profile:account.phonePlaceholder")}
                    className="p-5 dark:border-gray-500"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="profile-bio">
                    {t("profile:account.bio")}
                  </Label>
                  <Field
                    as={Textarea}
                    id="profile-bio"
                    name="bio"
                    readOnly={!isEditing}
                    placeholder={t("profile:account.bioPlaceholder")}
                    className="p-5 dark:border-gray-500"
                    rows={4}
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* Log Out */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Dialog
                    open={isPasswordDialogOpen}
                    onOpenChange={setIsPasswordDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="p-5 text-sm"
                      >
                        {t("profile:account.changePassword")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("profile:account.changePassword")}</DialogTitle>
                        <DialogDescription>
                          {t("profile:account.currentPasswordDescription")}
                        </DialogDescription>
                      </DialogHeader>
                      <Formik
                        initialValues={{
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={handlePasswordSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form noValidate className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                className="text-base"
                                htmlFor="current-password"
                              >
                                {t("profile:account.currentPassword")}
                              </Label>
                              <Field
                                as={Input}
                                id="current-password"
                                name="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                className="p-5 dark:border-gray-500"
                              />
                              <ErrorMessage
                                name="currentPassword"
                                component="div"
                                className="text-sm text-red-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                className="text-base"
                                htmlFor="new-password"
                              >
                                {t("profile:account.newPassword")}
                              </Label>
                              <Field
                                as={Input}
                                id="new-password"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                className="p-5 dark:border-gray-500"
                              />
                              <ErrorMessage
                                name="newPassword"
                                component="div"
                                className="text-sm text-red-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                className="text-base"
                                htmlFor="confirm-password"
                              >
                                {t("profile:account.confirmPassword")}
                              </Label>
                              <Field
                                as={Input}
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                className="p-5 dark:border-gray-500"
                              />
                              <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="text-sm text-red-500"
                              />
                            </div>

                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                              >
                                {isSubmitting
                                  ? t("profile:account.updating")
                                  : t("profile:account.updatePassword")}
                              </Button>
                            </DialogFooter>
                          </Form>
                        )}
                      </Formik>
                    </DialogContent>
                  </Dialog>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleLogout}
                    className="p-5 text-sm"
                  >
                    {t("profile:account.logOut")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileAccount;
