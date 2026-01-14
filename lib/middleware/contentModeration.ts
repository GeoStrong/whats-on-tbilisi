// lib/middleware/contentModeration.ts

/**
 * Content Moderation System for What'sOnTbilisi
 *
 * This module provides utilities for:
 * - Flagging user-generated content (activities, comments)
 * - Auto-moderating based on thresholds
 * - Building a moderation dashboard
 *
 * MVP: Simple flag-and-review system
 * v2: AI-powered spam/NSFW detection
 */

import { createError } from "@/lib/utils/errorHandler";

// Content types
export type ContentType = "activity" | "comment" | "profile";
export type FlagReason =
  | "spam"
  | "nsfw"
  | "harassment"
  | "misinformation"
  | "copyright"
  | "other";

// Database schema (for reference)
// CREATE TABLE flags (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   content_type content_type,
//   content_id uuid NOT NULL,
//   reported_by uuid NOT NULL REFERENCES profiles(id),
//   reason flag_reason,
//   description text,
//   resolved boolean DEFAULT false,
//   action_taken text, -- 'removed', 'warned', 'suspended', 'dismissed'
//   created_at timestamp DEFAULT now(),
//   resolved_at timestamp,
//   resolved_by uuid REFERENCES profiles(id),
//   UNIQUE(content_type, content_id, reported_by) -- user can only flag once per item
// );
// CREATE INDEX idx_flags_unresolved ON flags(resolved) WHERE resolved = false;

/**
 * Flag content for moderation review
 *
 * Usage:
 * ```
 * await flagContent({
 *   contentType: 'activity',
 *   contentId: '123-456',
 *   userId: user.id,
 *   reason: 'spam',
 *   description: 'Spam activity promoting crypto'
 * });
 * ```
 */
export async function flagContent({
  contentType,
  contentId,
  userId,
  reason,
  description,
}: {
  contentType: ContentType;
  contentId: string;
  userId: string;
  reason: FlagReason;
  description?: string;
}): Promise<void> {
  if (!contentId || !userId) {
    throw createError.validation("contentId and userId are required");
  }

  // TODO: Call Supabase to insert flag
  // const { error } = await supabase
  //   .from('flags')
  //   .insert({
  //     content_type: contentType,
  //     content_id: contentId,
  //     reported_by: userId,
  //     reason,
  //     description,
  //   });
  // if (error) throw createError.database(error.message);
}

/**
 * Check if content should be auto-hidden based on flag count
 *
 * Rules:
 * - 3+ flags: auto-hide, require moderator review to restore
 * - Spam flags: auto-hide immediately (if detection working)
 * - NSFW flags: auto-hide immediately (if detection working)
 */
export async function checkContentModeration(
  contentType: ContentType,
  contentId: string,
): Promise<{
  shouldHide: boolean;
  flagCount: number;
  reasons: FlagReason[];
}> {
  // TODO: Query Supabase
  // const { data: flags } = await supabase
  //   .from('flags')
  //   .select('reason')
  //   .eq('content_type', contentType)
  //   .eq('content_id', contentId)
  //   .eq('resolved', false);

  // Example threshold logic:
  const threshold = 3;
  // const flagCount = flags?.length ?? 0;
  // const reasons = flags?.map(f => f.reason) ?? [];
  // const hasAutoFlagReason = reasons.includes('nsfw') || reasons.includes('spam');

  return {
    // shouldHide: flagCount >= threshold || hasAutoFlagReason,
    // flagCount,
    // reasons,
    shouldHide: false,
    flagCount: 0,
    reasons: [],
  };
}

/**
 * Get all unresolved flags for moderation dashboard
 *
 * TODO: Implement moderation dashboard
 */
export async function getUnresolvedFlags() {
  // TODO: Query Supabase for all unresolved flags
  // SELECT * FROM flags WHERE resolved = false ORDER BY created_at DESC;
  // Return with pagination (50 per page)
  return [];
}

/**
 * Resolve a flag (moderator action)
 *
 * Actions:
 * - 'removed': Delete content
 * - 'warned': Send warning to user
 * - 'suspended': Suspend user account
 * - 'dismissed': Flag was false positive
 */
export async function resolveFlag({
  flagId,
  moderatorId,
  action,
  notes,
}: {
  flagId: string;
  moderatorId: string;
  action: "removed" | "warned" | "suspended" | "dismissed";
  notes?: string;
}): Promise<void> {
  // TODO: Update flag in Supabase
  // const { error } = await supabase
  //   .from('flags')
  //   .update({
  //     resolved: true,
  //     resolved_at: new Date(),
  //     resolved_by: moderatorId,
  //     action_taken: action,
  //   })
  //   .eq('id', flagId);
}

/**
 * Example: Activity comment for detecting spam
 *
 * TODO: Integrate with AI service (Cloudflare AI, OpenAI, etc.)
 * - Prompt injection detection
 * - URL detection (suspicious domains)
 * - Repeated phrases detection
 */
export function isLikelySpam(text: string): boolean {
  // Basic heuristics (replace with ML model)
  const spamIndicators = [
    /\b(crypto|forex|bitcoin|casino|lottery)\b/gi,
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/g, // URLs
    /(.)\1{4,}/g, // 5+ repeated chars
  ];

  return spamIndicators.some((pattern) => pattern.test(text));
}

/**
 * Example: Detect NSFW content
 *
 * TODO: Implement with:
 * - Cloudflare AI (free tier available)
 * - Google Vision API
 * - AWS Rekognition
 *
 * For now, client-side placeholder
 */
export async function detectNSFWImage(imageUrl: string): Promise<boolean> {
  // TODO: Call AI service
  // const response = await fetch('...', { body: imageUrl });
  // return response.nsfw_confidence > 0.7;
  return false;
}

/**
 * Rate limiting for flag creation
 *
 * Rules:
 * - Users can flag max 10 items per day (prevent false flag spam)
 * - Cannot flag same item twice (UNIQUE constraint prevents this)
 */
export async function canFlag(userId: string): Promise<boolean> {
  // TODO: Check flags count for user in last 24 hours
  // const { count } = await supabase
  //   .from('flags')
  //   .select('id', { count: 'exact' })
  //   .eq('reported_by', userId)
  //   .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000));

  // return (count ?? 0) < 10;
  return true;
}

/**
 * Get moderation stats
 *
 * Useful for dashboard
 */
export async function getModerationStats() {
  return {
    unflaggedCount: 0,
    activeModeratorCount: 0,
    avgResolutionTime: "24 hours",
    topReasons: ["spam", "nsfw", "harassment"],
  };
}

// ============================================================================
// DATABASE MIGRATION
// ============================================================================

/**
 * Run this migration to create the flags table in Supabase
 *
 * In Supabase SQL Editor:
 *
 * -- Create enum for content types
 * CREATE TYPE content_type AS ENUM ('activity', 'comment', 'profile');
 *
 * -- Create enum for flag reasons
 * CREATE TYPE flag_reason AS ENUM ('spam', 'nsfw', 'harassment', 'misinformation', 'copyright', 'other');
 *
 * -- Create flags table
 * CREATE TABLE flags (
 *   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   content_type content_type NOT NULL,
 *   content_id uuid NOT NULL,
 *   reported_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 *   reason flag_reason NOT NULL,
 *   description text,
 *   resolved boolean DEFAULT false,
 *   action_taken text,
 *   created_at timestamp DEFAULT now(),
 *   resolved_at timestamp,
 *   resolved_by uuid REFERENCES profiles(id),
 *   UNIQUE(content_type, content_id, reported_by),
 *   CHECK (resolved = false OR (resolved_at IS NOT NULL AND resolved_by IS NOT NULL))
 * );
 *
 * -- Create indexes for performance
 * CREATE INDEX idx_flags_unresolved ON flags(resolved, created_at DESC);
 * CREATE INDEX idx_flags_by_content ON flags(content_type, content_id);
 *
 * -- RLS Policy: Allow users to view flags (moderators see all, users see own)
 * ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "flags_select_if_admin_or_reporter" ON flags
 *   FOR SELECT
 *   USING (
 *     reported_by = auth.uid()
 *     OR EXISTS (
 *       SELECT 1 FROM profiles
 *       WHERE profiles.id = auth.uid() AND profiles.is_moderator = true
 *     )
 *   );
 *
 * CREATE POLICY "flags_insert_self" ON flags
 *   FOR INSERT
 *   WITH CHECK (reported_by = auth.uid());
 */

// ============================================================================
// MODERATION DASHBOARD (Frontend)
// ============================================================================

/**
 * TODO: Create pages/admin/moderation.tsx component
 *
 * Features:
 * - List unresolved flags
 * - Filter by reason, content type, date range
 * - View flagged content (activity, comment, profile)
 * - Take action: remove, warn, suspend, dismiss
 * - View moderation history
 * - Moderator analytics
 *
 * Example structure:
 *
 * export default function ModerationDashboard() {
 *   const [flags, setFlags] = useState([]);
 *   const [filter, setFilter] = useState<{reason?: FlagReason}>({});
 *
 *   useEffect(() => {
 *     // Load unresolved flags with filter
 *     getUnresolvedFlags().then(setFlags);
 *   }, [filter]);
 *
 *   return (
 *     <div>
 *       <h1>Moderation Dashboard</h1>
 *       <FilterBar onChange={setFilter} />
 *       <FlagList flags={flags} onResolve={handleResolveFlag} />
 *     </div>
 *   );
 * }
 */

// ============================================================================
// TODO: Future Enhancements
// ============================================================================

/**
 * 1. ML-powered spam detection
 *    - Train on flagged activities
 *    - Auto-quarantine suspicious content
 *
 * 2. Community moderation
 *    - Trusted users can flag without sending to moderators
 *    - Reputation system
 *
 * 3. Appeal system
 *    - Users can appeal removed content
 *    - Moderator review appeal
 *
 * 4. Automated responses
 *    - Send warning email to user on first flag
 *    - Suspend user after 3 removals
 *
 * 5. Integration with payment providers
 *    - Ability to refund/cancel paid events if moderated
 */
