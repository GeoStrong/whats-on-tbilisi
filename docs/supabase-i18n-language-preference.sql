-- Add language preference for i18n persistence
-- Run in Supabase SQL editor (staging first)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'en';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_preferred_language_check'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_preferred_language_check
      CHECK (preferred_language IN ('en', 'ka'));
  END IF;
END;
$$;
