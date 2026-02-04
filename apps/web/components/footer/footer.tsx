import Link from "next/link";
import React from "react";
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import FooterNavMobile from "./footerNavMobile";
import { getPWADisplayMode } from "@/lib/functions/helperFunctions";

const Footer: React.FC = () => {
  const isTWA = getPWADisplayMode() === "standalone";
  return (
    <>
      <footer className="border-t bg-white py-3 dark:border-gray-600 dark:bg-gray-900 md:px-6">
        <div className="hidden w-full md:block">
          <div className="flex flex-col items-center justify-around md:items-start">
            <Link className="text-lg" href="/">
              Feed
            </Link>
            <Link className="text-lg" href="/activities">
              Activities
            </Link>
            <Link className="text-lg" href="/discover">
              Discover
            </Link>
            <Link className="text-lg" href="/map">
              Map
            </Link>
            <Link className="text-lg" href="/create-activity">
              Create a New Activity
            </Link>
            <Link className="text-lg" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="text-lg" href="/terms">
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-col items-center justify-evenly gap-3 md:flex-row">
            <div className=""></div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2025 What&apos;sOn-Tbilisi. All rights reserved.
            </p>
            <div className="flex gap-2">
              <Link href="https://github.com/GeoStrong" target="_blank">
                <BsGithub className="text-lg" />
              </Link>
              <Link
                href="https://www.facebook.com/jobava.giorgi5/"
                target="_blank"
              >
                <BsFacebook className="text-lg" />
              </Link>
              <Link
                href="https://www.instagram.com/gio.jobava_/"
                target="_blank"
              >
                <BsInstagram className="text-lg" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/giorgi-jobava/"
                target="_blank"
              >
                <BsLinkedin className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`fixed bottom-0 ${isTWA ? "h-20" : "h-18"} w-full bg-white dark:bg-gray-900 md:hidden`}
        >
          <FooterNavMobile />
        </div>
      </footer>
    </>
  );
};
export default Footer;
