# What'sOnTbilisi – AI Coding Guide

## Architecture Overview

**Stack**: Next.js 16 App Router + TypeScript + Tailwind + Radix/shadcn UI + Redux Toolkit + TanStack Query + Supabase (auth/DB) + Cloudflare R2 (storage) + Google Maps + Sentry (monitoring)

**Provider nesting** ([app/layout.tsx](app/layout.tsx)): ErrorBoundary → ProgressiveBarProvider → StoreProvider (Redux) → QueryProvider (React Query) → ImageCacheProvider → ThemeProvider → UserInitializer → MainLayout + Footer. Do NOT reorder or add providers outside this hierarchy.

## State Management

**Redux store** ([lib/store/store.ts](lib/store/store.ts)) registers 4 slices: `map`, `auth`, `follower`, `user`. The `map` slice intentionally stores the non-serializable `google.maps.Map` instance; middleware explicitly ignores action `map/setMap` and path `map.map` to prevent warnings. Access map via `useAppSelector((state) => state.map.map)` and use `zoomToLocation` helper from [lib/functions/helperFunctions.ts](lib/functions/helperFunctions.ts).

**React Query config** ([lib/react-query/queryClient.ts](lib/react-query/queryClient.ts)): 5 min stale time, 30 min garbage collection, single retry, no refetch on focus. Always ensure query hooks are inside QueryProvider tree.

## Authentication & Authorization

**Auth flow**: Supabase browser client ([lib/supabase/supabaseClient.ts](lib/supabase/supabaseClient.ts)) + server helper with cookie wiring ([lib/supabase/server.ts](lib/supabase/server.ts)). UserInitializer ([components/auth/userInitializer.tsx](components/auth/userInitializer.tsx)) dispatches `fetchUserSession` thunk on mount; user data pulled via [lib/store/userSlice.ts](lib/store/userSlice.ts) thunks calling auth helpers in [lib/auth/auth.ts](lib/auth/auth.ts).

**API security pattern**: ALWAYS wrap protected API route handlers with `withAuth` from [lib/middleware/auth.ts](lib/middleware/auth.ts) (auto-handles auth check + error JSON). For ownership checks (e.g., user editing their profile), call `requireAuthorization(request, resourceUserId)`. Example:

```typescript
export const POST = withAuth(async (request, { user, supabase }) => {
  /* ... */
});
```

**Database security**: RLS policies in [docs/supabase-rls-policies.sql](docs/supabase-rls-policies.sql). Tables use `auth.uid()` for user-scoped access. Never bypass RLS in API routes.

## Error Handling & Logging

**Pattern**: Use `createError` factories and `errorHandler.handle()` from [lib/utils/errorHandler.ts](lib/utils/errorHandler.ts). API errors return consistent JSON via `errorHandler.toApiResponse(appError)` with proper status codes. Types: `VALIDATION`, `AUTHENTICATION`, `AUTHORIZATION`, `NOT_FOUND`, `DATABASE`, `NETWORK`, `UNKNOWN`.

**Logging**: ALWAYS use `logger` from [lib/utils/logger.ts](lib/utils/logger.ts) instead of `console`. Methods: `debug`, `info`, `warn`, `error`. Dev logs to console; prod ready for external sinks. Global ErrorBoundary ([components/ErrorBoundary.tsx](components/ErrorBoundary.tsx)) logs uncaught errors. Sentry configured via [instrumentation.ts](instrumentation.ts) for request error tracking.

## Image Upload & Storage

**R2 setup**: AWS S3 client in [lib/r2/r2.ts](lib/r2/r2.ts) configured with env vars from [lib/utils/env.ts](lib/utils/env.ts). Allowed types: jpeg, jpg, png, webp, gif. Max size: 10MB. All paths validated against traversal attacks.

**Upload workflow**: Frontend calls `handleUploadFile(folderDestination, file, user)` from [lib/functions/helperFunctions.ts](lib/functions/helperFunctions.ts) which:

1. Requests signed URL from `/api/upload-image` (POST with `{filePath, fileType}`)
2. PUTs file to signed URL
3. Returns final `filePath` (format: `folder/userId/uuid.ext`)

**Path validation**: Server enforces `userId` in path matches authenticated user. Never allow arbitrary paths. API routes: [app/api/upload-image/route.ts](app/api/upload-image/route.ts), [app/api/get-image-signed-url/route.ts](app/api/get-image-signed-url/route.ts), [app/api/delete-image/route.ts](app/api/delete-image/route.ts).

**Next.js image config** ([next.config.ts](next.config.ts)): Whitelists `*.r2.cloudflarestorage.com`, uses avif/webp formats, defines qualities 50-100, sets 1-year cache headers for `/_next/image`.

## UI & Layout

**Shell structure**: MainLayout ([components/general/mainLayout.tsx](components/general/mainLayout.tsx)) conditionally renders:

- SmartActivityCategoriesCarousel on `/activities` or `/map` routes
- SearchSection on `/activities` route
- Always: Toaster, VerificationDialogWrapper, SignupSuccessDialog, Header, Container

**Styling**: Tailwind + `@/*` path alias. Prettier auto-formats with tailwindcss plugin. Dark mode via ThemeProvider (system default). Purple progress bar (`#7c4dff`) from ProgressiveBarProvider.

## Data Models & Types

**Core types** ([lib/types.ts](lib/types.ts)): `UserProfile`, `ActivityEntity`, `ActivityParticipantsEntity`, `CommentEntity`, `Category`. Activity categories: 21 types (music, sport, theater, etc.). Activity fields include `googleLocation` (LatLngLiteral), `categories` (array), `maxAttendees`, nested `hostContact`.

**Database indexes** ([lib/db/indexes.sql](lib/db/indexes.sql)): Indexed on `user_id`, `created_at`, `date`, `status` for activities; composite indexes for followers, participants, comments. Run these in Supabase SQL editor for performance.

## Development Workflow

**Scripts**:

- `npm run dev` – Turbopack dev server (fast refresh)
- `npm run build` – Production build (check for type errors)
- `npm test` – Jest unit tests (jsdom, 50% coverage threshold)
- `npm run test:watch` – Jest watch mode
- `npm run test:e2e` – Playwright E2E (runs against dev server)
- `npm run test:e2e:ui` – Playwright UI mode

**Environment setup**: Copy `.env.example` to `.env.local`. Required: Supabase URL/anon key, R2 endpoint/keys/bucket. Optional: Google Maps API key, R2 dev URL. Validation throws on missing vars (warns in dev).

**Database setup**: Run indexes from [lib/db/indexes.sql](lib/db/indexes.sql) in Supabase SQL editor. Apply RLS policies from [docs/supabase-rls-policies.sql](docs/supabase-rls-policies.sql) (test in staging first).

## Conventions & Patterns

**File organization**: Pages in `app/`, components in `components/` by feature (activities, auth, feed, map, profile, users), utilities in `lib/` (auth, db, functions, hooks, middleware, store, supabase, types, utils).

**API routes**: Reference [docs/API.md](docs/API.md) for endpoint shapes. All routes return JSON. Protected routes use `withAuth`. Ownership routes use `requireAuthorization`.

**Component patterns**: Client components marked `"use client"`. Server actions in API routes (no inline server actions). Form handling via Formik + Yup. Activity comments use recursive threading via `groupCommentsOneLevel` helper.

**Linting**: ESLint config ([eslint.config.mjs](eslint.config.mjs)) treats `any` and unused vars as warnings (not errors). Run `npm run lint` before commits.

## Critical "Why" Decisions

- **Non-serializable map in Redux**: Google Maps instance stored for convenience (used across map, activities, POI selection). Middleware warning suppression is intentional.
- **No window focus refetch**: React Query disabled to prevent excessive API calls on tab switching (data freshness controlled by 5min stale time).
- **User ID in upload paths**: R2 security model enforces user ownership via path structure (`folder/userId/file`). Server validates userId matches auth.uid().
- **Next.js 16 with Turbopack**: Fast refresh in dev. React 19 compatible. App Router required for server components.
- **Sentry + instrumentation**: Captures request errors via `onRequestError` export. Separate configs for edge/server runtimes.

## Troubleshooting Tips

**Map not loading**: Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` and ensure Maps API enabled in Google Cloud Console.

**Upload fails**: Verify R2 credentials and bucket name. Check browser network tab for signed URL response. Path must include user ID.

**RLS policy errors**: User likely not authenticated or trying to access others' data. Check `auth.uid()` in Supabase SQL editor.

**Type errors on build**: Run `npm run build` locally. Common issues: missing types in `lib/types.ts`, incorrect Redux dispatch types, async component props.

Need clarification on specific feature flows (e.g., activity creation, follower system, comment threading) or data models? Ask for targeted deep-dives.
