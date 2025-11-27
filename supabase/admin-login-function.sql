-- =====================================================
-- FUNÇÃO: admin_login_or_create
-- =====================================================
-- Esta função permite que o usuário admin seja criado/logado com role correto
-- Usar esta RPC em vez de tentar fazer signUp/signIn direto

CREATE OR REPLACE FUNCTION public.admin_login_or_create(
  admin_email TEXT,
  admin_password TEXT,
  admin_nome TEXT DEFAULT 'Administrador'
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  role TEXT,
  success BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_role app_role;
BEGIN
  -- Tenta encontrar usuário existente
  SELECT id INTO v_user_id FROM auth.users WHERE email = admin_email LIMIT 1;
  
  -- Se não existe, a função de auth.signUp não pode ser chamada aqui
  -- Então apenas preparamos para o sign-in
  IF v_user_id IS NULL THEN
    -- Retorna mensagem para fazer signUp no cliente
    RETURN QUERY SELECT 
      NULL::UUID,
      admin_email,
      'none'::TEXT,
      FALSE::BOOLEAN,
      'User not found. Must SignUp first'::TEXT;
    RETURN;
  END IF;
  
  -- Se existe, garante que tem role admin
  DELETE FROM public.user_roles 
  WHERE user_id = v_user_id 
  AND role != 'admin';
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Verifica role final
  SELECT role INTO v_role FROM public.user_roles 
  WHERE user_id = v_user_id 
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'parceiro' THEN 2 ELSE 3 END
  LIMIT 1;
  
  RETURN QUERY SELECT 
    v_user_id,
    admin_email,
    COALESCE(v_role::TEXT, 'investidor'),
    TRUE::BOOLEAN,
    'Admin role set successfully'::TEXT;
END;
$$;

-- =====================================================
-- TESTE (execute no SQL Editor):
-- SELECT * FROM public.admin_login_or_create('admin@admin.com', '1dumilde1@A');
-- =====================================================
