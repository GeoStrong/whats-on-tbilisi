"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const UserNotFoundClient: React.FC = () => {
  const { t } = useTranslation(["users"]);

  return (
    <div className="mt-10 h-full w-full text-center">
      <h3 className="mb-3 text-lg">
        {t("users:userNotFound")}{" "}
        <span className="dark:linear-dark linear-light">
          {t("users:userNotFound")}
        </span>
      </h3>
      <p className="">
        {t("users:checkUrl")}{" "}
        <Link href="/" className="text-primary">
          {t("users:backHome")}
        </Link>
      </p>
    </div>
  );
};

export default UserNotFoundClient;
