import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { errorHandler, createError } from '@/lib/utils/errorHandler';
import { logger } from '@/lib/utils/logger';

/**
 * Authentication middleware for API routes
 */
export async function requireAuth(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const {
      data: { user },
      error: authError,
    } = bearer ? await supabase.auth.getUser(bearer) : await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthenticated API request', {
        path: request.nextUrl.pathname,
        method: request.method,
      });
      throw createError.authentication('Authentication required');
    }

    return { user, supabase };
  } catch (error) {
    const appError = errorHandler.handle(error, {
      path: request.nextUrl.pathname,
      method: request.method,
    });
    throw appError;
  }
}

/**
 * Wrapper for API route handlers that require authentication
 */
export function withAuth<T>(
  handler: (request: NextRequest, context: { user: any; supabase: any }) => Promise<T>,
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    try {
      const { user, supabase } = await requireAuth(request);
      return await handler(request, { user, supabase });
    } catch (error) {
      const appError = errorHandler.handle(error);
      return NextResponse.json(errorHandler.toApiResponse(appError), {
        status: appError.statusCode,
      });
    }
  };
}

/**
 * Check if user is authorized to perform action on resource
 */
export async function requireAuthorization(
  request: NextRequest,
  resourceUserId: string,
) {
  const { user } = await requireAuth(request);

  if (user.id !== resourceUserId) {
    logger.warn('Unauthorized API request', {
      userId: user.id,
      resourceUserId,
      path: request.nextUrl.pathname,
    });
    throw createError.authorization('You do not have permission to perform this action');
  }

  return { user };
}

