import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import {
  defaultLocale,
  localeCookieName,
  normalizeLocale,
} from "./lib/i18n/config";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const locale =
    normalizeLocale(request.cookies.get(localeCookieName)?.value) ??
    defaultLocale;

  response.headers.set("Content-Language", locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // you can narrow this to only routes that need Supabase/Sessions
  ],
};
