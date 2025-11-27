-- =====================================================
-- FIX: Criar função set_user_as_admin com assinatura correta
-- =====================================================
-- Execute este script se ainda não funcionar

-- Versão 1: Por UUID (mais segura)
CREATE OR REPLACE FUNCTION public.set_user_as_admin(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove outras roles e insere admin
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Para testar: SELECT public.set_user_as_admin('USER-ID-AQUI'::UUID);

-- =====================================================
-- Versão 2: Por Email (para compatibilidade)
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_user_as_admin_by_email(admin_email TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Busca user por email
  SELECT id INTO v_user_id FROM auth.users WHERE email = admin_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 
      FALSE,
      'User not found with email: ' || admin_email,
      NULL::UUID;
    RETURN;
  END IF;
  
  -- Remove outras roles
  DELETE FROM public.user_roles 
  WHERE user_id = v_user_id;
  
  -- Insere admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN QUERY SELECT 
    TRUE,
    'Admin role granted successfully',
    v_user_id;
END;
$$;

-- Para testar: SELECT * FROM public.set_user_as_admin_by_email('admin@admin.com');
