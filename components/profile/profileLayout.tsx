"use client";

import React from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProfileHeader from "./profileHeader";
import ProfileLayoutLoading from "./profileLayoutLoading";
import { redirect } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import { BsCalendar2Event } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const { user } = useGetUserProfile();

  const pathname = usePathname();

  if (user === undefined) redirect("/");

  const isActive = (path: string) => {
    if (path === "/profile") {
      return pathname === "/profile" || pathname === "/profile/";
    }
    return pathname === path;
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col gap-6">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>

          <div className="flex flex-col gap-6 md:flex-row">
            <ProfileHeader user={user} />

            <div className="w-full">
              {/* Profile Navigation */}
              <nav
                className="mb-6 flex gap-4 rounded-xl border p-5 shadow-md dark:bg-gray-800"
                aria-label="Profile navigation"
              >
                <LayoutGroup>
                  <ul className="flex w-full items-start justify-between gap-4 md:flex-row md:items-center md:gap-6">
                    <li
                      className={`relative hover:text-primary ${
                        isActive("/profile") && "text-primary"
                      }`}
                    >
                      <Link
                        href="/profile"
                        className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:flex-row"
                        aria-label="Activities"
                        aria-current={isActive("/profile") ? "page" : undefined}
                      >
                        <BsCalendar2Event
                          className="text-xl md:text-lg"
                          aria-hidden="true"
                        />
                        <span className="hidden text-base md:ml-1 md:block">
                          My Activities
                        </span>
                      </Link>
                      {isActive("/profile") && (
                        <motion.div
                          layoutId="profile-underline"
                          className="absolute bottom-[-8px] h-[2px] w-full bg-primary md:bottom-[-12px]"
                        />
                      )}
                    </li>

                    <li
                      className={`relative hover:text-primary ${
                        isActive("/profile/posts") && "text-primary"
                      }`}
                    >
                      <Link
                        href="/profile/posts"
                        className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:flex-row"
                        aria-label="Posts"
                        aria-current={
                          isActive("/profile/posts") ? "page" : undefined
                        }
                      >
                        <FiFileText
                          className="text-xl md:text-lg"
                          aria-hidden="true"
                        />
                        <span className="hidden text-base md:ml-1 md:block">
                          My Posts
                        </span>
                      </Link>
                      {isActive("/profile/posts") && (
                        <motion.div
                          layoutId="profile-underline"
                          className="absolute bottom-[-8px] h-[2px] w-full bg-primary md:bottom-[-12px]"
                        />
                      )}
                    </li>

                    <li
                      className={`relative hover:text-primary ${
                        isActive("/profile/account") && "text-primary"
                      }`}
                    >
                      <Link
                        href="/profile/account"
                        className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:flex-row"
                        aria-label="Account"
                        aria-current={
                          isActive("/profile/account") ? "page" : undefined
                        }
                      >
                        <AiOutlineUser
                          className="text-xl md:text-lg"
                          aria-hidden="true"
                        />
                        <span className="hidden text-base md:ml-1 md:block">
                          Account
                        </span>
                      </Link>
                      {isActive("/profile/account") && (
                        <motion.div
                          layoutId="profile-underline"
                          className="absolute bottom-[-8px] h-[2px] w-full bg-primary md:bottom-[-12px]"
                        />
                      )}
                    </li>

                    <li
                      className={`relative hover:text-primary ${
                        isActive("/profile/preferences") && "text-primary"
                      }`}
                    >
                      <Link
                        href="/profile/preferences"
                        className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:flex-row"
                        aria-label="Preferences"
                        aria-current={
                          isActive("/profile/preferences") ? "page" : undefined
                        }
                      >
                        <FiSettings
                          className="text-xl md:text-lg"
                          aria-hidden="true"
                        />
                        <span className="hidden text-base md:ml-1 md:block">
                          Preferences
                        </span>
                      </Link>
                      {isActive("/profile/preferences") && (
                        <motion.div
                          layoutId="profile-underline"
                          className="absolute bottom-[-8px] h-[2px] w-full bg-primary md:bottom-[-12px]"
                        />
                      )}
                    </li>
                  </ul>
                </LayoutGroup>
              </nav>

              {/* Content Area */}
              <div className="rounded-lg border shadow-md dark:border-slate-700 dark:bg-gray-800">
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProfileLayoutLoading />
      )}
    </>
  );
};

export default ProfileLayout;
