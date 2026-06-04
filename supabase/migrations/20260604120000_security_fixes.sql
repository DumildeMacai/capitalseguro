-- Prevent privilege escalation on profiles.is_admin
CREATE OR REPLACE FUNCTION public.prevent_is_admin_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_is_admin boolean;
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    SELECT is_admin INTO caller_is_admin FROM public.profiles WHERE id = auth.uid();
    IF COALESCE(caller_is_admin, false) <> true THEN
      RAISE EXCEPTION 'Only admins can change is_admin';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_is_admin_self_update ON public.profiles;
CREATE TRIGGER trg_prevent_is_admin_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_is_admin_self_update();

REVOKE ALL ON FUNCTION public.prevent_is_admin_self_update() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_user_type(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
