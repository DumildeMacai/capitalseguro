-- ==================================================
-- FUNÇÕES RPC FALTANTES
-- ==================================================
-- Execute este script para criar as funções RPC necessárias

/* =====================================================
   CRIAR FUNÇÃO: get_user_type
   
   Usada por useUserRoles.ts para obter o tipo de usuário
   ===================================================== */

DROP FUNCTION IF EXISTS public.get_user_type(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_type(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY created_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_type(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_type(UUID) TO anon;

/* =====================================================
   CRIAR FUNÇÃO: get_user_roles
   
   Retorna todas as roles do usuário
   ===================================================== */

DROP FUNCTION IF EXISTS public.get_user_roles(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE(role TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO anon;

/* =====================================================
   VERIFICAÇÃO FINAL
   ===================================================== */

-- Verificar que as funções foram criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_type', 'get_user_roles', 'is_admin', 'has_role')
ORDER BY routine_name;
