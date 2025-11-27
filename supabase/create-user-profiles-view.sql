-- Create views for simplified user profile queries with roles
-- This allows querying users by type without referencing the removed 'tipo' column

BEGIN;

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.users_by_role CASCADE;

-- Create a view that joins profiles with their primary role from user_roles
CREATE VIEW public.users_by_role AS
SELECT 
  p.id,
  p.email,
  p.nome_completo,
  p.telefone,
  p.empresa_nome,
  p.ramo_negocio,
  p.bio,
  p.endereco,
  p.cidade,
  p.provincia,
  p.data_criacao,
  p.updated_at,
  p.documento_frente,
  p.documento_verso,
  COALESCE(
    (SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY CASE ur.role WHEN 'admin' THEN 1 WHEN 'parceiro' THEN 2 ELSE 3 END LIMIT 1),
    'investidor'::app_role
  ) AS tipo
FROM public.profiles p;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

COMMIT;

-- Notes:
-- - This view allows filtering by role without the removed 'tipo' column
-- - Use: SELECT * FROM public.users_by_role WHERE tipo = 'parceiro'::app_role
-- - The view always returns 'investidor' as default if no role is found
