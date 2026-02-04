/**
 * API response types
 */

import { Session } from "@supabase/supabase-js";

export interface ApiErrorResponse {
  error: {
    type: string;
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Session type for Redux store
 */
export type AppSession = Session | null;
