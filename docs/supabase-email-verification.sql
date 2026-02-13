-- Custom email verification support for Supabase Auth + Resend
-- Run this in the Supabase SQL editor (staging first).
-- Adjust table names if your profiles table is not `public.users`.

-- Ensure pgcrypto exists for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add verification timestamp to your public users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

-- Token storage (server-side only)
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  sent_to_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id
  ON public.email_verification_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at
  ON public.email_verification_tokens (expires_at);

ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Only server-side (service_role) should read/write tokens.
-- No RLS policies are created for this table.

-- Helper to check if user is verified (used in RLS policies)
CREATE OR REPLACE FUNCTION public.is_user_verified(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = uid
      AND email_verified_at IS NOT NULL
  );
$$;

REVOKE ALL ON FUNCTION public.is_user_verified(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_user_verified(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_verified(uuid) TO service_role;

-- Atomic verification consume + update
CREATE OR REPLACE FUNCTION public.verify_email_token(p_token_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id
  FROM public.email_verification_tokens
  WHERE token_hash = verify_email_token.p_token_hash
    AND consumed_at IS NULL
    AND expires_at > now()
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.email_verification_tokens
    SET consumed_at = now()
    WHERE token_hash = verify_email_token.p_token_hash;

  UPDATE public.users
    SET email_verified_at = now()
    WHERE id = v_user_id
      AND email_verified_at IS NULL;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_email_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_email_token(text) TO service_role;

-- Prevent clients from updating verification state directly
REVOKE UPDATE (email_verified_at) ON public.users FROM authenticated;

-- ========================================================================
-- RLS policy updates (require verification for writes)
-- ========================================================================
-- NOTE: These statements assume you used the policy names from
-- `docs/supabase-rls-policies.sql`. If yours differ, update names accordingly.

-- Activities (owner column is user_id)
DROP POLICY IF EXISTS "activities_insert_own" ON public.activities;
CREATE POLICY "activities_insert_own" ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activities_update_own" ON public.activities;
CREATE POLICY "activities_update_own" ON public.activities
  FOR UPDATE
  USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activities_delete_own" ON public.activities;
CREATE POLICY "activities_delete_own" ON public.activities
  FOR DELETE
  USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- Activity categories
DROP POLICY IF EXISTS "activity_categories_insert_own_activity" ON public.activity_categories;
CREATE POLICY "activity_categories_insert_own_activity" ON public.activity_categories
  FOR INSERT
  WITH CHECK (
    public.is_user_verified(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_categories.activity_id
        AND activities.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "activity_categories_delete_own_activity" ON public.activity_categories;
CREATE POLICY "activity_categories_delete_own_activity" ON public.activity_categories
  FOR DELETE
  USING (
    public.is_user_verified(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_categories.activity_id
        AND activities.user_id = auth.uid()
    )
  );

-- Activity participants
DROP POLICY IF EXISTS "activity_participants_insert_self" ON public.activity_participants;
CREATE POLICY "activity_participants_insert_self" ON public.activity_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activity_participants_delete_self" ON public.activity_participants;
CREATE POLICY "activity_participants_delete_self" ON public.activity_participants
  FOR DELETE
  USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activity_participants_delete_creator" ON public.activity_participants;
CREATE POLICY "activity_participants_delete_creator" ON public.activity_participants
  FOR DELETE
  USING (
    public.is_user_verified(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_participants.activity_id
        AND activities.user_id = auth.uid()
    )
  );

-- Activity comments
DROP POLICY IF EXISTS "activity_comments_insert_auth" ON public.activity_comments;
CREATE POLICY "activity_comments_insert_auth" ON public.activity_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activity_comments_update_own" ON public.activity_comments;
CREATE POLICY "activity_comments_update_own" ON public.activity_comments
  FOR UPDATE
  USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "activity_comments_delete_own_or_creator" ON public.activity_comments;
CREATE POLICY "activity_comments_delete_own_or_creator" ON public.activity_comments
  FOR DELETE
  USING (
    public.is_user_verified(auth.uid()) AND
    (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM public.activities
        WHERE activities.id = activity_comments.activity_id
          AND activities.user_id = auth.uid()
      )
    )
  );

-- Followers
DROP POLICY IF EXISTS "followers_insert_self" ON public.followers;
CREATE POLICY "followers_insert_self" ON public.followers
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "followers_delete_self" ON public.followers;
CREATE POLICY "followers_delete_self" ON public.followers
  FOR DELETE
  USING (auth.uid() = follower_id AND public.is_user_verified(auth.uid()));

-- Saved activities
DROP POLICY IF EXISTS "saved_activities_insert_own" ON public.saved_activities;
CREATE POLICY "saved_activities_insert_own" ON public.saved_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

DROP POLICY IF EXISTS "saved_activities_delete_own" ON public.saved_activities;
CREATE POLICY "saved_activities_delete_own" ON public.saved_activities
  FOR DELETE
  USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- Optional: additional tables used by the app.
-- Uncomment and adjust if these tables exist in your database.
-- DROP POLICY IF EXISTS "feed_posts_insert_own" ON public.feed_posts;
-- CREATE POLICY "feed_posts_insert_own" ON public.feed_posts
--   FOR INSERT
--   WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- DROP POLICY IF EXISTS "feed_posts_update_own" ON public.feed_posts;
-- CREATE POLICY "feed_posts_update_own" ON public.feed_posts
--   FOR UPDATE
--   USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()))
--   WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- DROP POLICY IF EXISTS "feed_posts_delete_own" ON public.feed_posts;
-- CREATE POLICY "feed_posts_delete_own" ON public.feed_posts
--   FOR DELETE
--   USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- DROP POLICY IF EXISTS "user_activity_reactions_insert_own" ON public.user_activity_reactions;
-- CREATE POLICY "user_activity_reactions_insert_own" ON public.user_activity_reactions
--   FOR INSERT
--   WITH CHECK (auth.uid() = user_id AND public.is_user_verified(auth.uid()));

-- DROP POLICY IF EXISTS "user_activity_reactions_delete_own" ON public.user_activity_reactions;
-- CREATE POLICY "user_activity_reactions_delete_own" ON public.user_activity_reactions
--   FOR DELETE
--   USING (auth.uid() = user_id AND public.is_user_verified(auth.uid()));
