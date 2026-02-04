"use client";

import React from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import useScreenSize from "@/lib/hooks/useScreenSize";
import { Textarea } from "../ui/textarea";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import { Input } from "../ui/input";
import {
  handleUploadUserInformation,
  participationSignUp,
} from "@/lib/profile/profile";
import { toast } from "sonner";
import defaultUserImg from "@/public/images/default-user.png";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";

const ActivityParticipation: React.FC<{
  activityId: string;
  isNested?: boolean;
  isBtnLarge?: boolean;
}> = ({ activityId, isNested, isBtnLarge }) => {
  const { user } = useGetUserProfile();
  const { isMobile } = useScreenSize();
  const { handleReplace } = useAddSearchQuery();

  const initialValues = {
    email: user?.email || "",
    phone: user?.phone || "",
    additionalInfo: "",
  };

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .max(20, "Phone number is too long"),
    additionalInfo: Yup.string().max(200, "Additional information is too long"),
  });

  const { imageUrl } = useOptimizedImage(user?.avatar_path || "", {
    quality: 50,
    width: 800,
    height: 600,
    fallback: defaultUserImg.src,
  });

  return (
    <>
      <Drawer
        repositionInputs={false}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerTrigger
          className={`h-12 rounded-md bg-primary px-8 text-white ${isBtnLarge && "w-3/4 md:w-auto"}`}
        >
          Participate
        </DrawerTrigger>
        <DrawerContent className={`w-full ${isNested && "md:w-2/6"}`}>
          <DrawerHeader>
            <DrawerTitle className="mb-3 text-center text-xl">
              <span className="linear-light">Join the Activity!</span>
              😃
            </DrawerTitle>
            <DrawerDescription className="text-base">
              Please provide any additional information you&apos;d like the
              organizer to know:
            </DrawerDescription>
            <div className="text-left">
              <h4 className="text-lg">Signing up as</h4>
              <div className="flex items-center gap-5 rounded-xl p-2 shadow-md">
                <OptimizedImage
                  src={imageUrl}
                  width={20}
                  height={20}
                  containerClassName="h-16 w-16 rounded-full"
                  alt="profile"
                  quality={50}
                  priority={false}
                />
                <span className="text-lg font-bold">{user?.name}</span>
              </div>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                if (!user?.phone || user?.phone !== values.phone) {
                  await handleUploadUserInformation(
                    user!,
                    user?.name,
                    values.phone,
                  );
                }
                await participationSignUp(
                  user!.id,
                  activityId,
                  values.additionalInfo,
                );

                toast.success("You have successfully signed up!");
                handleReplace(new URLSearchParams(""));
                location.reload();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      placeholder={user?.email || "Email"}
                      className="h-12 border bg-gray-300 text-lg dark:border-gray-600 dark:bg-gray-900"
                      disabled
                    />
                    <div className="text-left text-base text-gray-500">
                      We will contact you via this email.
                    </div>
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      className="h-12 border text-lg dark:border-gray-600"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-base text-red-500"
                    />
                    <span className="pl-1 text-left text-base text-gray-500">
                      (Optional)
                    </span>
                    <Field
                      className="text-lg dark:border-gray-600"
                      as={Textarea}
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Additional Information..."
                    />
                    <ErrorMessage
                      name="additionalInfo"
                      component="div"
                      className="text-base text-red-500"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 text-base text-white"
                    >
                      {isSubmitting ? "Signing up..." : "Sign me up!"}
                    </Button>
                    <DrawerClose className="h-12 text-base">Close</DrawerClose>
                  </div>
                </Form>
              )}
            </Formik>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default ActivityParticipation;
