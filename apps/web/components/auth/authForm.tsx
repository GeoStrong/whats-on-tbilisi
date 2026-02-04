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
import { signIn, signUp } from "@/lib/auth/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const [isSignin, setIsSignin] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const SignSchema = Yup.object().shape({
    fullName: isSignin
      ? Yup.string().notRequired()
      : Yup.string().min(2, "Too short!").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: isSignin
      ? Yup.string()
      : Yup.string().min(6, "At least 6 characters").required("Required"),
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
        onOpenChange(false);
        dispatch(authActions.setSignupSuccessOpen(true));
        return;
      }

      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to What&apos;sOn-Tbilisi</DialogTitle>
            <DialogDescription>
              {isSignin
                ? "Sign in to your account"
                : "Create a new account below"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" onClick={() => setIsSignin(true)}>
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsSignin(false)}>
                Sign Up
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
                      <Label htmlFor="fullName">Full Name</Label>
                      <Field
                        name="fullName"
                        as={Input}
                        placeholder="John Doe"
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
                    <Label htmlFor="email">Email</Label>
                    <Field
                      name="email"
                      as={Input}
                      type="email"
                      placeholder="your@email.com"
                      id="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Field
                      name="password"
                      as={Input}
                      type="password"
                      placeholder="••••••••"
                      id="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  >
                    {isSubmitting
                      ? isSignin
                        ? "Signing in..."
                        : "Creating account..."
                      : isSignin
                        ? "Sign In"
                        : "Sign Up"}
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
