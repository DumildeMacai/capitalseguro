-- Setup Storage buckets for investimentos and avatars
-- Run this in the Supabase SQL Editor

BEGIN;

-- =====================================================
-- Create investimentos bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('investimentos', 'investimentos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to investimentos
CREATE POLICY "Public read investimentos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'investimentos');

-- Allow admins to upload to investimentos
CREATE POLICY "Admin upload investimentos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'investimentos' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Allow admins to delete from investimentos
CREATE POLICY "Admin delete investimentos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'investimentos' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- Create avatars bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to avatars
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow users to upload their own avatars
CREATE POLICY "User upload avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatars
CREATE POLICY "User update avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatars
CREATE POLICY "User delete avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMIT;

-- Notes:
-- - investimentos bucket: public read, admin upload/delete
-- - avatars bucket: public read, user upload/update/delete own avatars
-- - Run this in Supabase SQL Editor to set up storage buckets and policies
