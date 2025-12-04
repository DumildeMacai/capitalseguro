-- Corrigir função get_user_type para retornar tipos em português
CREATE OR REPLACE FUNCTION public.get_user_type(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_is_admin BOOLEAN;
BEGIN
  SELECT is_admin INTO user_is_admin FROM profiles WHERE id = user_id;
  IF user_is_admin = true THEN
    RETURN 'admin';
  END IF;
  RETURN 'investidor';
END;
$$;