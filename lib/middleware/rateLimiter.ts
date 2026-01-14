import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

// Simple in-memory rate limit store (for single-instance deployments)
// For production with multiple instances, use Redis or Upstash
const store: RateLimitStore = {};

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
  keyGenerator?: (request: NextRequest) => string;
  onLimitExceeded?: (key: string) => void;
}

/**
 * Simple rate limiting middleware
 * Use with Upstash or Redis for distributed deployments
 *
 * Example:
 * ```
 * const limiter = createRateLimiter({
 *   maxRequests: 10,
 *   windowMs: 60 * 1000, // 1 minute
 *   keyGenerator: (req) => req.ip || 'unknown',
 * });
 *
 * export const POST = withAuth(
 *   rateLimit(limiter, handleUpload)
 * );
 * ```
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    maxRequests,
    windowMs,
    keyGenerator = (req) => {
      // Get IP from headers (for Vercel and other proxies)
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
      return ip;
    },
    onLimitExceeded,
  } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(request);
    const now = Date.now();

    // Clean up old entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or increment
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return null; // Allow request
    }

    store[key].count += 1;

    if (store[key].count > maxRequests) {
      onLimitExceeded?.(key);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
        },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((store[key].resetTime - now) / 1000)) } }
      );
    }

    return null; // Allow request
  };
}

/**
 * Middleware wrapper to apply rate limiting to a handler
 */
export function withRateLimit(
  limiter: ReturnType<typeof createRateLimiter>,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const limitResponse = await limiter(request);
    if (limitResponse) return limitResponse;
    return handler(request);
  };
}

// Recommended rate limits for different endpoints
export const RATE_LIMITS = {
  // Auth endpoints
  SIGNUP: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 mins
  LOGIN: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 per 15 mins
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour

  // Upload endpoints
  IMAGE_UPLOAD: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  ACTIVITY_UPLOAD: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // Public endpoints
  ACTIVITY_CREATE: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5 per day
  COMMENT_CREATE: { maxRequests: 30, windowMs: 60 * 60 * 1000 }, // 30 per hour
  SEARCH: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute

  // API rate limits (aggressive)
  API_GENERAL: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute
};

/**
 * TODO: For production, migrate to Upstash Redis:
 * 
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * 
 * export const upstashLimiter = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(10, "1 h"),
 * });
 * 
 * Then use:
 * const { success } = await upstashLimiter.limit(key);
 * if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
 */
