-- ==================================================
-- LIMPEZA DE POLÍTICAS ANTIGAS E DUPLICADAS
-- ==================================================
-- Execute este script para remover políticas antigas
-- que referenciam colunas não-existentes

/* Remover políticas antigas de storage */
DROP POLICY IF EXISTS "Admin delete investimentos" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload investimentos" ON storage.objects;
DROP POLICY IF EXISTS "Admins view documentos" ON storage.objects;
DROP POLICY IF EXISTS "Users delete documentos" ON storage.objects;
DROP POLICY IF EXISTS "Users update documentos" ON storage.objects;
DROP POLICY IF EXISTS "Users upload documentos" ON storage.objects;
DROP POLICY IF EXISTS "User delete avatar" ON storage.objects;
DROP POLICY IF EXISTS "User update avatar" ON storage.objects;
DROP POLICY IF EXISTS "User upload avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read documentos" ON storage.objects;
DROP POLICY IF EXISTS "Public read investimentos" ON storage.objects;

/* Remover políticas antigas de profiles */
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert for new users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Verificar políticas restantes (deve ter apenas as novas)
SELECT 
  tablename,
  policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'objects')
ORDER BY tablename, policyname;
