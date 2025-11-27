-- Migration: Add email column to profiles and sync with auth.users
-- Run this in the Supabase SQL Editor (or psql connected to your DB).

BEGIN;

-- 1) Add column if missing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 2) Populate existing rows from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.id
  AND (p.email IS NULL OR p.email = '');

-- 3) Replace handle_new_user trigger function to populate email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, tipo, nome_completo, telefone, email)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tipo')::user_type, 'investidor'),
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'telefone',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4) Recreate trigger to ensure it points to the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5) Create sync function to propagate email updates
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email();

COMMIT;

-- Notes:
-- - This migration is safe to run multiple times (uses IF NOT EXISTS and ON CONFLICT DO NOTHING).
-- - Run this in Supabase SQL Editor with a sufficiently privileged user (Project Owner).
-- - After running, the `profiles.email` column will be populated and kept in sync when auth.users.email changes.
