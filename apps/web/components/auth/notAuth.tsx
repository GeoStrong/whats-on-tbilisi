import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { BsFillLockFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";

const NotAuth: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="mt-10 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-md dark:bg-gray-900">
          <BsFillLockFill className="text-2xl" />
          <h2 className="text-xl font-bold">You are not signed in</h2>
          <p className="text-lg">
            To view this page you need to sign in to your account
          </p>
          <p className="text-lg">
            But you can still check out the{" "}
            <Link href="/activities" className="text-primary underline">
              Activities
            </Link>
          </p>
          <div className="mt-6 flex w-full justify-center">
            <Button
              variant="secondary"
              className="w-full border text-lg"
              onClick={() => {
                dispatch(authActions.setAuthDialogOpen(true));
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotAuth;
