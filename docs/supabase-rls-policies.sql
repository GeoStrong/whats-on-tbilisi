-- What'sOnTbilisi Supabase RLS Policies
-- Execute these in the Supabase SQL Editor to enable Row Level Security
-- WARNING: Test in a staging environment first

-- Enable RLS on all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_activities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================
-- Everyone can read all profiles (public user data)
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Only system can insert (via trigger or auth callback)
CREATE POLICY "profiles_insert_system" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ACTIVITIES TABLE POLICIES
-- ============================================================================
-- Everyone can read all activities (public discovery)
CREATE POLICY "activities_select_all" ON public.activities
  FOR SELECT
  USING (true);

-- Activity creator can insert new activities
CREATE POLICY "activities_insert_own" ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Activity creator can update their own activities
CREATE POLICY "activities_update_own" ON public.activities
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Activity creator can delete their own activities
CREATE POLICY "activities_delete_own" ON public.activities
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- ACTIVITY_CATEGORIES TABLE POLICIES (Join table: activities ↔ categories)
-- ============================================================================
-- Everyone can read activity categories
CREATE POLICY "activity_categories_select_all" ON public.activity_categories
  FOR SELECT
  USING (true);

-- Only activity creator can insert categories for their activity
CREATE POLICY "activity_categories_insert_own_activity" ON public.activity_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_categories.activity_id
        AND activities.created_by = auth.uid()
    )
  );

-- Only activity creator can delete categories from their activity
CREATE POLICY "activity_categories_delete_own_activity" ON public.activity_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_categories.activity_id
        AND activities.created_by = auth.uid()
    )
  );

-- ============================================================================
-- ACTIVITY_PARTICIPANTS TABLE POLICIES
-- ============================================================================
-- Everyone can read participants (see who joined)
CREATE POLICY "activity_participants_select_all" ON public.activity_participants
  FOR SELECT
  USING (true);

-- Users can join activities (insert themselves)
CREATE POLICY "activity_participants_insert_self" ON public.activity_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only remove themselves from activities
CREATE POLICY "activity_participants_delete_self" ON public.activity_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- Activity creator can remove participants
CREATE POLICY "activity_participants_delete_creator" ON public.activity_participants
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_participants.activity_id
        AND activities.created_by = auth.uid()
    )
  );

-- ============================================================================
-- ACTIVITY_COMMENTS TABLE POLICIES
-- ============================================================================
-- Everyone can read comments
CREATE POLICY "activity_comments_select_all" ON public.activity_comments
  FOR SELECT
  USING (true);

-- Authenticated users can post comments
CREATE POLICY "activity_comments_insert_auth" ON public.activity_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own comments
CREATE POLICY "activity_comments_update_own" ON public.activity_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments, or activity creator can delete any comment
CREATE POLICY "activity_comments_delete_own_or_creator" ON public.activity_comments
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_comments.activity_id
        AND activities.created_by = auth.uid()
    )
  );

-- ============================================================================
-- FOLLOWERS TABLE POLICIES
-- ============================================================================
-- Everyone can read follower data (who follows whom)
CREATE POLICY "followers_select_all" ON public.followers
  FOR SELECT
  USING (true);

-- Users can only create follow relationships for themselves
CREATE POLICY "followers_insert_self" ON public.followers
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can only remove their own follow relationships
CREATE POLICY "followers_delete_self" ON public.followers
  FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- SAVED_ACTIVITIES TABLE POLICIES
-- ============================================================================
-- Users can only read their own saved activities
CREATE POLICY "saved_activities_select_own" ON public.saved_activities
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only save activities for themselves
CREATE POLICY "saved_activities_insert_own" ON public.saved_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own saved activities
CREATE POLICY "saved_activities_delete_own" ON public.saved_activities
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. These policies are conservative but allow core functionality:
--    - Public read (discovery)
--    - Users control their own data (CRUD on own resources)
--    - Creators control their activities and can moderate comments
--
-- 2. If you add timestamps (created_at, updated_at):
--    - Ensure your client doesn't send timestamps; let server set them
--    - Use CURRENT_TIMESTAMP in INSERT defaults
--
-- 3. For moderators/admins:
--    - Add an admin/moderator flag to profiles table
--    - Add policies that allow admins to delete/update any content
--    - Example:
--      CREATE POLICY "activities_delete_admin" ON public.activities
--        FOR DELETE
--        USING (
--          EXISTS (
--            SELECT 1 FROM public.profiles
--            WHERE profiles.id = auth.uid()
--              AND profiles.role = 'admin'
--          )
--        );
--
-- 4. To test policies:
--    - Use Supabase client with explicit .select() calls
--    - Check that unauthenticated requests can read but not modify
--    - Check that authenticated users can only modify their own data
--
-- 5. To disable RLS (for emergency or migration):
--    ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
--    -- Then re-enable after migration/fix
--    ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
