"use client";

import React from "react";
import Link from "next/link";
import { LayoutGroup, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import HeaderProfile from "./headerProfile";
import HeaderProfileLoader from "./headerProfileLoader";
import { AiOutlineAppstore } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { UserProfile } from "@/lib/types";
import { BiHomeAlt2, BiSearchAlt2 } from "react-icons/bi";

interface HeaderNavProps {
  onAuthClick: () => void;
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const HeaderNav: React.FC<HeaderNavProps> = ({
  onAuthClick,
  user,
  isLoading,
  isAuthenticated,
}) => {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="hidden items-center gap-3 md:flex"
        aria-label="Main navigation"
      >
        <LayoutGroup>
          <ul className="flex items-center gap-6">
            <li
              className={`relative hover:text-primary ${pathname === "/" && "border-primary text-primary"}`}
            >
              <Link
                href="/"
                className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Feed"
                aria-current={pathname === "/" ? "page" : undefined}
              >
                <BiHomeAlt2 className="text-base" aria-hidden="true" />
                Feed
              </Link>
              {pathname === "/" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] w-full bg-primary"
                />
              )}
            </li>
            <li
              className={`relative hover:text-primary ${pathname === "/activities" && "border-primary text-primary"}`}
            >
              <Link
                href="/activities"
                className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Activities"
                aria-current={pathname === "/activities" ? "page" : undefined}
              >
                <AiOutlineAppstore className="text-base" aria-hidden="true" />
                Activities
              </Link>
              {pathname === "/activities" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] w-full bg-primary"
                />
              )}
            </li>
            <li
              className={`relative flex flex-col items-center gap-1 hover:text-primary ${pathname === "/search" && "border-primary text-primary"}`}
            >
              <Link
                href="/discover"
                className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Search and Discover"
                aria-current={
                  pathname === "/discover" || pathname === "/search"
                    ? "page"
                    : undefined
                }
              >
                <BiSearchAlt2 className="text-lg" aria-hidden="true" />
                Search
              </Link>
              {pathname === "/search" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] w-full bg-primary"
                />
              )}
            </li>
            <li
              className={`relative flex flex-col items-center gap-1 hover:text-primary ${pathname === "/map" && "border-primary text-primary"}`}
            >
              <Link
                href="/map"
                className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Map"
                aria-current={pathname === "/map" ? "page" : undefined}
              >
                <FiMapPin className="text-base" aria-hidden="true" />
                Map
              </Link>
              {pathname === "/map" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] w-full bg-primary"
                />
              )}
            </li>
            {isAuthenticated && (
              <li
                className={`relative flex flex-col items-center gap-1 hover:text-primary ${pathname === "/create-activity" && "border-primary text-primary"}`}
              >
                <Link
                  href="/create-activity"
                  className="mb-1 flex h-12 items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Create Activity"
                  aria-current={
                    pathname === "/create-activity" ? "page" : undefined
                  }
                >
                  <AiOutlinePlusCircle
                    className="text-base"
                    aria-hidden="true"
                  />
                  Create Activity
                </Link>
              </li>
            )}

            <li className={`hover:text-primary`}>
              {isLoading ? (
                <HeaderProfileLoader />
              ) : !isAuthenticated || !user ? (
                <Button
                  onClick={onAuthClick}
                  variant="ghost"
                  className="gap-2 border"
                  aria-label="Sign in to your account"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="md:inline">Sign In</span>
                </Button>
              ) : (
                <HeaderProfile user={user} />
              )}
            </li>
          </ul>
        </LayoutGroup>
      </nav>
    </>
  );
};
export default HeaderNav;
