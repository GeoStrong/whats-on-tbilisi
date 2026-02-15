import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { Noto_Sans_Georgian } from "next/font/google";
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
import {
  defaultLocale,
  localeCookieName,
  normalizeLocale,
} from "@/lib/i18n/config";
import I18nProvider from "@/components/providers/I18nProvider";

const myFont = localFont({
  src: "../public/fonts/GT-Walsheim-Regular-Trial.woff2",
  style: "normal",
  weight: "400",
  variable: "--font-myFont",
});

const georgianFont = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "What’sOnTbilisi",
  description: "Every event. Every Tbilisi resident",
  icons: [
    {
      rel: "icon",
      url: "/favicon.png",
      type: "image/png",
      sizes: "48x48",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-icon.svg",
      sizes: "180x180",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale =
    normalizeLocale(cookieStore.get(localeCookieName)?.value) ?? defaultLocale;

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" sizes="180x180" />
      </head>
      <body
        className={`${myFont.variable} ${georgianFont.variable} antialiased`}
      >
        <ErrorBoundary>
          <ProgressiveBarProvider>
            <StoreProvider>
              <QueryProvider>
                <ImageCacheProvider>
                  <I18nProvider initialLocale={locale}>
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
                  </I18nProvider>
                </ImageCacheProvider>
              </QueryProvider>
            </StoreProvider>
          </ProgressiveBarProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
