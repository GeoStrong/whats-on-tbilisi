import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/auth";
import ProfileAvatar from "../general/profileAvatar";
import Link from "next/link";
import { UserProfile } from "@/lib/types";
import useScreenSize from "@/lib/hooks/useScreenSize";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import { useTranslation } from "react-i18next";

const HeaderProfile: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const { isMobile } = useScreenSize();
  const { t } = useTranslation(["navigation"]);

  const { imageUrl } = useOptimizedImage(user?.avatar_path || "", {
    quality: 50,
    width: 800,
    height: 600,
  });

  return (
    <>
      {isMobile ? (
        <Link href="/profile">
          <ProfileAvatar image={imageUrl || ""} />
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ProfileAvatar image={imageUrl || ""} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="dark:bg-gray-900">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" className="cursor-pointer">
              <DropdownMenuItem>{t("navigation:profile")}</DropdownMenuItem>
            </Link>
            <Link href="/profile/preferences" className="cursor-pointer">
              <DropdownMenuItem>{t("navigation:settings")}</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                window.location.reload();
              }}
            >
              {t("navigation:logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
export default HeaderProfile;
