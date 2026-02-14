"use client";

import React from "react";
import Link from "next/link";
import { LayoutGroup, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import HeaderProfile from "./headerProfile";
import HeaderProfileLoader from "./headerProfileLoader";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { UserProfile } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddSquareIcon,
  Calendar03Icon,
  Home04Icon,
  Route02Icon,
  Search02Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";

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
                <HugeiconsIcon
                  icon={Home04Icon}
                  className="h-6 w-6"
                  strokeWidth={2}
                />
                <span
                  className={`text-sm ${pathname === "/" && "font-semibold"} `}
                >
                  Feed
                </span>
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
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  className="h-6 w-6"
                  strokeWidth={2}
                />
                <span
                  className={`text-sm ${pathname === "/activities" && "font-semibold"} `}
                >
                  Activities
                </span>
              </Link>
              {pathname === "/activities" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] w-full bg-primary"
                />
              )}
            </li>
            <li
              className={`relative flex flex-col items-center gap-1 hover:text-primary ${pathname === "/discover" && "border-primary text-primary"}`}
            >
              <Link
                href="/discover"
                className="mb-1 flex flex-col items-center gap-1 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Search and Discover"
                aria-current={pathname === "/discover" ? "page" : undefined}
              >
                <HugeiconsIcon
                  icon={Search02Icon}
                  className="h-6 w-6"
                  strokeWidth={2}
                />
                <span
                  className={`text-sm ${pathname === "/discover" && "font-semibold"} `}
                >
                  Search
                </span>
              </Link>
              {pathname === "/discover" && (
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
                <HugeiconsIcon
                  icon={Route02Icon}
                  className="h-6 w-6"
                  strokeWidth={2}
                />
                <span
                  className={`text-sm ${pathname === "/map" && "font-semibold"} `}
                >
                  Map
                </span>
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
                  <HugeiconsIcon icon={AddSquareIcon} />
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
                  <HugeiconsIcon
                    icon={User03Icon}
                    className="h-5 w-5"
                    strokeWidth={2}
                  />
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
