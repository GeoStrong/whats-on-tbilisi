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
import { signOut } from "@/lib/auth/auth";
import { useDispatch } from "react-redux";
import { userActions } from "@/lib/store/userSlice";
import { AppDispatch } from "@/lib/store/store";
import { handleUploadUserInformation } from "@/lib/profile/profile";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";
import { redirect } from "next/navigation";

interface ProfileAccountProps {
  user: UserProfile | null;
}

interface FormValues {
  name: string;
  phone: string;
  bio: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters")
    .required("Name is required"),
  phone: Yup.string()
    .max(20, "Phone number cannot exceed 20 characters")
    .nullable(),
  bio: Yup.string().max(100, "Bio cannot exceed 100 characters").nullable(),
});

const ProfileAccount: React.FC<ProfileAccountProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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
    try {
      await handleUploadUserInformation(
        user,
        values.name,
        values.phone,
        values.bio,
      );
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      logger.error("Failed to update profile", error);
      toast.error("Failed to save changes. Please try again.");
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
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  <CardDescription className="text-base">
                    Update your personal information and bio.
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
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!dirty || !isValid || isSubmitting}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="profile-name">
                    Name
                  </Label>
                  <Field
                    as={Input}
                    id="profile-name"
                    name="name"
                    type="text"
                    readOnly={!isEditing}
                    placeholder="Enter your name"
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
                    Email
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
                    Phone
                  </Label>
                  <Field
                    as={Input}
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    readOnly={!isEditing}
                    placeholder="+123456789"
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
                    Bio
                  </Label>
                  <Field
                    as={Textarea}
                    id="profile-bio"
                    name="bio"
                    readOnly={!isEditing}
                    placeholder="Tell us about yourself..."
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogout}
                  className="p-5 text-sm"
                >
                  Log out
                </Button>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileAccount;
