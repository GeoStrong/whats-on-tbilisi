import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { BsFillLockFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";
import { useTranslation } from "react-i18next";

const NotAuth: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["auth", "navigation"]);

  return (
    <>
      <div className="mt-10 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-md dark:bg-gray-900">
          <BsFillLockFill className="text-2xl" />
          <h2 className="text-xl font-bold">{t("auth:notAuth.title")}</h2>
          <p className="text-lg">
            {t("auth:notAuth.description")}
          </p>
          <p className="text-lg">
            {t("auth:notAuth.activitiesLeadIn")}{" "}
            <Link href="/activities" className="text-primary underline">
              {t("auth:notAuth.activitiesLink")}
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
              {t("navigation:signIn")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotAuth;
