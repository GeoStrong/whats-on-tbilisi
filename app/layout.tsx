import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import StoreProvider from "@/lib/store/storeProvider";
import ProgressiveBarProvider from "@/components/general/progressiveBarProvider";
import { UserInitializer } from "@/components/auth/userInitializer";
import LayoutManager from "@/components/general/LayoutManager";
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
  icons: [
    {
      rel: "icon",
      url: "/icon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-icon.svg",
      sizes: "180x180",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" sizes="180x180" />
      </head>
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
                    <LayoutManager>{children}</LayoutManager>
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
