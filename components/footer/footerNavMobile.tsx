"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddSquareIcon,
  Calendar03Icon,
  Home04Icon,
  Route02Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons";

const FooterNavMobile: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer
      className="w-full py-3 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul className="flex justify-around">
        <li className="flex items-start">
          <Link
            href="/"
            className="rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Feed"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <HugeiconsIcon
              icon={Home04Icon}
              className={`h-6 w-6 ${pathname === "/" && "text-primary"}`}
              strokeWidth={pathname === "/" ? 2 : 1.5}
            />
          </Link>
        </li>
        <li className="flex items-start">
          <Link
            href="/activities"
            className="rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Activities"
            aria-current={pathname === "/activities" ? "page" : undefined}
          >
            <HugeiconsIcon
              icon={Calendar03Icon}
              className={`h-6 w-6 ${pathname === "/activities" && "text-primary"}`}
              strokeWidth={pathname === "/activities" ? 2 : 1.5}
            />
          </Link>
        </li>
        <li className="flex items-start">
          <Link
            href="/create-activity"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Create Activity"
            aria-current={pathname === "/create-activity" ? "page" : undefined}
          >
            <HugeiconsIcon
              icon={AddSquareIcon}
              className={`h-8 w-8 ${pathname === "/create-activity" && "text-primary"}`}
            />
          </Link>
        </li>
        <li className="flex items-start">
          <Link
            href="/discover"
            className="rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Search and Discover"
            aria-current={pathname === "/discover" ? "page" : undefined}
          >
            <HugeiconsIcon
              icon={Search02Icon}
              className={`h-6 w-6 ${pathname === "/discover" && "text-primary"}`}
              strokeWidth={pathname === "/discover" ? 2 : 1.5}
            />
          </Link>
        </li>
        <li className="flex items-start">
          <Link
            href="/map"
            className="rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Map"
            aria-current={pathname === "/map" ? "page" : undefined}
          >
            <HugeiconsIcon
              icon={Route02Icon}
              className={`h-6 w-6 ${pathname === "/map" && "text-primary"}`}
              strokeWidth={pathname === "/map" ? 2 : 1.5}
            />
          </Link>
        </li>
      </ul>
    </footer>
  );
};
export default FooterNavMobile;
