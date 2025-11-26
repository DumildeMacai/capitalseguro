-- Setup Admin User
-- This script creates or updates the admin user with email: admin@admin.com

-- First, ensure the user exists in auth.users (this needs to be done from Supabase dashboard)
-- Then, create or update the profile with admin role

-- Check if profile exists for admin@admin.com
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO admin_id 
  FROM auth.users 
  WHERE email = 'admin@admin.com' 
  LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    -- Update existing profile to be admin
    UPDATE public.profiles 
    SET tipo = 'admin'
    WHERE id = admin_id;
    
    RAISE NOTICE 'Admin user updated: %', admin_id;
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users. Please create the user first in Supabase dashboard.';
  END IF;
END $$;
