"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeaderNav from "./headerNav";
import AuthDialog from "../auth/authForm";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { authActions } from "@/lib/store/authSlice";
import HeaderProfile from "./headerProfile";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { authDialogOpen } = useSelector((state: RootState) => state.auth);
  const { user, isLoading, isAuthenticated } = useGetUserProfile();

  const setAuthDialogOpen = (value: boolean) => {
    dispatch(authActions.setAuthDialogOpen(value));
  };

  const openAuthDialog = () => {
    setAuthDialogOpen(true);
  };

  return (
    <header
      className={`sticky top-0 z-40 flex w-full items-center justify-between border-b bg-white px-6 pb-2 pt-2 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-900 md:px-20 md:pb-0`}
    >
      <Link
        href="/"
        className="linear-yellow flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="What'sOnTbilisi Home"
      >
        <Image
          src="/icon.svg"
          alt="What'sOnTbilisi logo"
          width={40}
          height={40}
          priority
          className="drop-shadow-sm"
        />
        <span className="gradient-primary hidden bg-clip-text text-2xl font-bold text-transparent lg:inline">
          What&apos;sOnTbilisi
        </span>
      </Link>
      <HeaderNav
        user={user}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        onAuthClick={openAuthDialog}
      />
      <div className="md:hidden">
        {isLoading ? (
          <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        ) : !isAuthenticated || !user ? (
          <Button onClick={openAuthDialog} variant="outline" className="gap-2">
            Sign in
          </Button>
        ) : (
          <HeaderProfile user={user} />
        )}
      </div>

      {authDialogOpen && (
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      )}
    </header>
  );
};
export default Header;
