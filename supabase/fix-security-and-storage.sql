-- ==================================================
-- CORREÇÃO CRÍTICA DE SEGURANÇA E STORAGE (VERSÃO REVISADA)
-- Execute este script no SQL Editor do Supabase
-- Implementações: migração segura, RLS sem recursão, hardening
-- ==================================================

/* -------------------------
   PARTE 0: LIMPEZAS INICIAIS
   ------------------------- */
-- (Remover antigas funções/policies que possam causar conflito)
DROP POLICY IF EXISTS "Usuários podem ver suas próprias roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem ver todas as roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem inserir roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem atualizar roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem deletar roles" ON public.user_roles;

DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON public.profiles;

DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de seus documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os documentos" ON storage.objects;

-- Garantir que funções antigas que mudam tipo de retorno sejam removidas
DROP FUNCTION IF EXISTS public.get_user_type(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_roles(UUID) CASCADE;

-- -----------------------------------------------------
-- PARTE 1: CRIAR SISTEMA SEGURO DE ROLES (ENUM + TABELA)
-- -----------------------------------------------------
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'parceiro', 'investidor');

DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Constraint adicional (hardening) - garante que role está no enum
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_role_valid CHECK (role = ANY(enum_range(NULL::public.app_role)));

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- -----------------------------------------------------
-- PARTE 1.5: Função segura para verificar roles (no recursion)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- -----------------------------------------------------
-- PARTE 1.6: Policies RLS para user_roles
-- -----------------------------------------------------
CREATE POLICY "Usuários podem ver suas próprias roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem inserir roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PARTE 2: ATUALIZAR TABELA PROFILES (migrar coluna 'tipo')
-- =====================================================
-- Garantir que policies dependentes de 'tipo' foram droppadas (feito no topo)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='tipo'
  ) THEN
    -- Migrar somente valores válidos do enum para evitar erros de cast
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, tipo::text::app_role
    FROM public.profiles
    WHERE tipo IS NOT NULL
      AND tipo::text = ANY(enum_range(NULL::public.app_role)::text[])
    ON CONFLICT (user_id, role) DO NOTHING;

    -- (Opcional) Registar rows inválidas para análise — não aborta a migração
    -- Se quiseres inspecionar, podes gravar num log ou SELECT posteriormente:
    -- SELECT id, tipo FROM public.profiles WHERE tipo IS NOT NULL AND tipo::text NOT = ANY(enum_range(NULL::public.app_role)::text[]);

    -- Agora remover a coluna tipo
    ALTER TABLE public.profiles DROP COLUMN tipo CASCADE;
  END IF;
END $$;

-- =====================================================
-- PARTE 3: POLÍTICAS RLS PARA PROFILES (sem recursão)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem deletar seu próprio perfil"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar todos os perfis"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PARTE 4: POLÍTICAS DE STORAGE (sem recursão) - corrigido
-- =====================================================
-- Assegura que storage schema exista e habilita RLS se aplicável (storage.objects já tem RLS controlado pelo Supabase)
-- Criar policies seguras de acesso por pasta (foldername)

CREATE POLICY "Usuários podem visualizar seus próprios documentos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem fazer upload de seus documentos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem atualizar seus próprios documentos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar seus próprios documentos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documentos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para admins (FOR ALL) agora com USING + WITH CHECK para proteção completa
CREATE POLICY "Admins podem gerenciar todos os documentos"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documentos' AND
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'documentos' AND
    public.has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- PARTE 5: FUNÇÕES (get_user_roles, get_user_type, update_user_profile)
-- =====================================================
-- 5.0 Funções antigas já droppadas no topo do script

-- 5.1 Função para obter roles do usuário (SETOF)
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS SETOF app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_roles.user_id = $1;
$$;

-- 5.2 Função para obter role primária (compatibilidade)
CREATE OR REPLACE FUNCTION public.get_user_type(user_id UUID)
RETURNS app_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
BEGIN
  -- Prioridade: admin > parceiro > investidor
  SELECT role INTO v_role
  FROM public.user_roles
  WHERE user_roles.user_id = $1
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'parceiro' THEN 2
      WHEN 'investidor' THEN 3
    END
  LIMIT 1;
  
  RETURN COALESCE(v_role, 'investidor'::app_role);
END;
$$;

-- 5.3 Atualizar função update_user_profile (remover campo tipo) - idempotente
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  nome_completo TEXT DEFAULT NULL,
  telefone TEXT DEFAULT NULL,
  endereco TEXT DEFAULT NULL,
  cidade TEXT DEFAULT NULL,
  provincia TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  doc_frente TEXT DEFAULT NULL,
  doc_verso TEXT DEFAULT NULL,
  empresa_nome TEXT DEFAULT NULL,
  ramo_negocio TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    nome_completo,
    telefone,
    endereco,
    cidade,
    provincia,
    bio,
    documento_frente,
    documento_verso,
    empresa_nome,
    ramo_negocio
  )
  VALUES (
    user_id,
    nome_completo,
    telefone,
    endereco,
    cidade,
    provincia,
    bio,
    doc_frente,
    doc_verso,
    empresa_nome,
    ramo_negocio
  )
  ON CONFLICT (id) DO UPDATE SET
    nome_completo = COALESCE(EXCLUDED.nome_completo, profiles.nome_completo),
    telefone = COALESCE(EXCLUDED.telefone, profiles.telefone),
    endereco = COALESCE(EXCLUDED.endereco, profiles.endereco),
    cidade = COALESCE(EXCLUDED.cidade, profiles.cidade),
    provincia = COALESCE(EXCLUDED.provincia, profiles.provincia),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    documento_frente = COALESCE(EXCLUDED.documento_frente, profiles.documento_frente),
    documento_verso = COALESCE(EXCLUDED.documento_verso, profiles.documento_verso),
    empresa_nome = COALESCE(EXCLUDED.empresa_nome, profiles.empresa_nome),
    ramo_negocio = COALESCE(EXCLUDED.ramo_negocio, profiles.ramo_negocio),
    updated_at = NOW();
END;
$$;

-- =====================================================
-- PARTE 6: TRIGGER DE NOVO USUÁRIO (idempotente + seguro)
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
BEGIN
  -- Criar perfil de forma idempotente
  INSERT INTO public.profiles (id, nome_completo, telefone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'telefone'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Determinar e inserir role (só se valor for válido)
  IF NEW.raw_user_meta_data->>'tipo' IS NOT NULL
     AND (NEW.raw_user_meta_data->>'tipo') = ANY(enum_range(NULL::public.app_role)::text[])
  THEN
    v_role := (NEW.raw_user_meta_data->>'tipo')::app_role;
  ELSE
    v_role := 'investidor'::app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- (Se tens um trigger que chama handle_new_user, não te esqueças de criar/atualizar o trigger binding:
-- Exemplo:)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PARTE 7: FUNÇÃO PARA DEFINIR ADMIN
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_user_as_admin(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- =====================================================
-- FINAL: INSTRUÇÕES RÁPIDAS
-- =====================================================
-- 1) Executa todo este bloco no SQL Editor do Supabase.
-- 2) Para promover um user a admin:
--    SELECT public.set_user_as_admin('SEU-USER-ID-AQUI');
-- 3) Para verificar as roles do user atual:
--    SELECT * FROM public.user_roles WHERE user_id = auth.uid();
-- 4) Se precisares auditar valores antigos de "tipo" que não casaram com o enum:
--    SELECT id, tipo FROM public.profiles WHERE tipo IS NOT NULL
--      AND tipo::text NOT = ANY(enum_range(NULL::public.app_role)::text[]);
