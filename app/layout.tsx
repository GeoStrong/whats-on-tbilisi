import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Footer from "@/components/footer/footer";
import StoreProvider from "@/lib/store/storeProvider";
import MainLayout from "@/components/general/mainLayout";
import ProgressiveBarProvider from "@/components/general/progressiveBarProvider";
import { UserInitializer } from "@/components/auth/userInitializer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ImageCacheProvider } from "@/lib/context/ImageCacheContext";

const myFont = localFont({
  src: "../public/fonts/GT-Walsheim-Regular-Trial.woff2",
  style: "normal",
  weight: "400",
  variable: "--font-myFont",
});

export const metadata: Metadata = {
  title: "What’sOnTbilisi",
  description: "Every event. Every Tbilisi resident",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${myFont.variable} antialiased`}>
        <ErrorBoundary>
          <ProgressiveBarProvider>
            <StoreProvider>
              <QueryProvider>
                <ImageCacheProvider>
                  <ThemeProvider
                    attribute="class"
                    enableSystem
                    defaultTheme="system"
                  >
                    <UserInitializer />
                    <main className="flex min-h-[90dvh] flex-col pb-10">
                      <MainLayout>{children}</MainLayout>
                    </main>
                    <Footer />
                  </ThemeProvider>
                </ImageCacheProvider>
              </QueryProvider>
            </StoreProvider>
          </ProgressiveBarProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
