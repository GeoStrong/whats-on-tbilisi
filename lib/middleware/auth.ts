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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
 * Require email-verified user for sensitive actions.
 */
export async function requireVerified(request: NextRequest) {
  const { user, supabase } = await requireAuth(request);

  const { data: profile, error } = await supabase
    .from('users')
    .select('email_verified_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw createError.database('Failed to verify user status', { error });
  }

  if (!profile?.email_verified_at) {
    throw createError.authorization('Email verification required');
  }

  return { user, supabase };
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
 * Wrapper for API route handlers that require verified users
 */
export function withVerified<T>(
  handler: (request: NextRequest, context: { user: any; supabase: any }) => Promise<T>,
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    try {
      const { user, supabase } = await requireVerified(request);
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

