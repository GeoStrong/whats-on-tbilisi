"use client";

import { usePathname } from "next/navigation";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import MainLayout from "./mainLayout";
import Footer from "../footer/footer";

export default function LayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <>
        <LandingHeader />
        <main className="flex min-h-[90dvh] flex-col">{children}</main>
        <LandingFooter />
      </>
    );
  }

  return (
    <>
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  );
}
