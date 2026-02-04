/**
 * Type guard utilities for runtime type checking
 */

import { ActivityEntity, UserProfile, CommentEntity } from "../types";

/**
 * Type guard for ActivityEntity
 */
export function isActivityEntity(value: unknown): value is ActivityEntity {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.location === "string"
  );
}

/**
 * Type guard for UserProfile
 */
export function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.name === "string"
  );
}

/**
 * Type guard for CommentEntity
 */
export function isCommentEntity(value: unknown): value is CommentEntity {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.activity_id === "string" &&
    typeof obj.user_id === "string" &&
    typeof obj.text === "string"
  );
}

/**
 * Type guard for array of ActivityEntity
 */
export function isActivityEntityArray(value: unknown): value is ActivityEntity[] {
  return Array.isArray(value) && value.every(isActivityEntity);
}

/**
 * Type guard for string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard for number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Type guard for non-null value
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

