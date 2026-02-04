import { logger } from './logger';

/**
 * Application error types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler utility functions
 */
export const errorHandler = {
  /**
   * Handle and log errors consistently
   */
  handle(error: unknown, context?: Record<string, unknown>): AppError {
    if (error instanceof AppError) {
      logger.error(error.message, error, { ...context, type: error.type });
      return error;
    }

    if (error instanceof Error) {
      const appError = new AppError(ErrorType.UNKNOWN, error.message, 500, context);
      logger.error('Unhandled error', error, context);
      return appError;
    }

    const appError = new AppError(
      ErrorType.UNKNOWN,
      'An unknown error occurred',
      500,
      context,
    );
    logger.error('Unknown error type', new Error(String(error)), context);
    return appError;
  },

  /**
   * Create user-friendly error messages
   */
  getUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message || 'Please check your input and try again.';
      case ErrorType.AUTHENTICATION:
        return 'You need to be logged in to perform this action.';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.DATABASE:
        return 'A database error occurred. Please try again later.';
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  },

  /**
   * Create standardized API error response
   */
  toApiResponse(error: AppError) {
    return {
      error: {
        type: error.type,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          context: error.context,
        }),
      },
    };
  },
};

/**
 * Helper to create specific error types
 */
export const createError = {
  validation: (message: string, context?: Record<string, unknown>) =>
    new AppError(ErrorType.VALIDATION, message, 400, context),
  authentication: (message: string = 'Authentication required', context?: Record<string, unknown>) =>
    new AppError(ErrorType.AUTHENTICATION, message, 401, context),
  authorization: (message: string = 'Authorization required', context?: Record<string, unknown>) =>
    new AppError(ErrorType.AUTHORIZATION, message, 403, context),
  notFound: (message: string = 'Resource not found', context?: Record<string, unknown>) =>
    new AppError(ErrorType.NOT_FOUND, message, 404, context),
  database: (message: string, context?: Record<string, unknown>) =>
    new AppError(ErrorType.DATABASE, message, 500, context),
  network: (message: string, context?: Record<string, unknown>) =>
    new AppError(ErrorType.NETWORK, message, 503, context),
};

