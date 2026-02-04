"use client";

import React from "react";
import Link from "next/link";
import { useLocation } from "react-use";
import { FiMapPin } from "react-icons/fi";
import { AiOutlineAppstore, AiOutlinePlusCircle } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";

const FooterNavMobile: React.FC = () => {
  const { pathname } = useLocation();

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
            <BiHomeAlt2
              className={`text-2xl ${pathname === "/" && "text-primary"}`}
              aria-hidden="true"
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
            <AiOutlineAppstore
              className={`text-2xl ${pathname === "/activities" && "text-primary"}`}
              aria-hidden="true"
            />
          </Link>
        </li>
        <li className="flex items-start">
          <Link
            href="/create-activity"
            className="-translate-y-2 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Create Activity"
            aria-current={pathname === "/create-activity" ? "page" : undefined}
          >
            <AiOutlinePlusCircle
              className={`text-4xl ${pathname === "/create-activity" && "text-primary"}`}
              aria-hidden="true"
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
            <BiSearchAlt2
              className={`text-2xl ${pathname === "/discover" && "text-primary"}`}
              aria-hidden="true"
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
            <FiMapPin
              className={`text-2xl ${pathname === "/map" && "text-primary"}`}
              aria-hidden="true"
            />
          </Link>
        </li>
      </ul>
    </footer>
  );
};
export default FooterNavMobile;
