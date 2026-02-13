-- Custom password reset support for Supabase Auth + Resend
-- Run this in the Supabase SQL editor (staging first).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Token storage (server-side only)
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  sent_to_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
  ON public.password_reset_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
  ON public.password_reset_tokens (expires_at);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Password reset request logs for rate limiting and auditing
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash text NOT NULL,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_requests_email_created
  ON public.password_reset_requests (email_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_password_reset_requests_ip_created
  ON public.password_reset_requests (ip_hash, created_at DESC);

ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- No RLS policies are intentionally created.
-- Only server-side (service_role) should read/write these tables.

-- Resolve auth user by email (service role only)
CREATE OR REPLACE FUNCTION public.get_auth_user_for_password_reset(p_email text)
RETURNS TABLE (user_id uuid, user_email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT id, email
  FROM auth.users
  WHERE lower(email) = lower(trim(p_email))
    AND deleted_at IS NULL
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_auth_user_for_password_reset(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_user_for_password_reset(text) TO service_role;

-- Atomically consume a valid token and return linked user/email
CREATE OR REPLACE FUNCTION public.consume_password_reset_token(p_token_hash text)
RETURNS TABLE (user_id uuid, sent_to_email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.password_reset_tokens
  SET consumed_at = now()
  WHERE token_hash = p_token_hash
    AND consumed_at IS NULL
    AND expires_at > now()
  RETURNING password_reset_tokens.user_id, password_reset_tokens.sent_to_email;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_password_reset_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_password_reset_token(text) TO service_role;
