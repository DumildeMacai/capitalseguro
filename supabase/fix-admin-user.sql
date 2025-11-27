-- Fix Admin User Type and Role
-- Execute este script no SQL Editor do Supabase para garantir que o usuário admin tem role 'admin'
-- A tabela user_roles é usada pela RPC get_user_type() para retornar o tipo de usuário

-- Passo 1: Garantir que o perfil admin existe com dados corretos
INSERT INTO public.profiles (id, nome_completo, bio, created_at, updated_at)
SELECT 
  u.id,
  'Administrador',
  'Conta administrativa do sistema',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE
SET 
  nome_completo = 'Administrador',
  bio = 'Conta administrativa do sistema',
  updated_at = NOW();

-- Passo 2: Garantir que o registro em user_roles existe com role='admin'
-- Buscar o UID do admin e inserir/atualizar em user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'admin'::app_role
FROM auth.users u
WHERE u.email = 'admin@admin.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Se a constraint não for (user_id, role), tentar:
-- Se já existe outro role para este user, remover os antigos
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@admin.com' LIMIT 1)
AND role != 'admin';

-- Passo 3: Verificar resultado
SELECT 
  u.id,
  u.email,
  ur.role,
  p.nome_completo
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@admin.com';
