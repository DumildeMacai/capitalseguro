-- ==================================================
-- CORREÇÃO CRÍTICA DE SEGURANÇA E STORAGE
-- ==================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige recursão infinita e implementa sistema seguro de roles

-- =====================================================
-- PARTE 1: CRIAR SISTEMA SEGURO DE ROLES
-- =====================================================

-- 1.1 Criar enum para roles
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'parceiro', 'investidor');

-- 1.2 Criar tabela de roles de usuário (separada de profiles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 1.3 Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 1.4 Criar função SECURITY DEFINER para verificar roles (evita recursão)
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
  )
$$;

-- 1.5 Políticas RLS para user_roles
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
-- PARTE 2: ATUALIZAR TABELA PROFILES
-- =====================================================

-- 2.1 Remover campo 'tipo' da tabela profiles (movido para user_roles)
-- Primeiro, migrar dados existentes para user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, tipo::text::app_role
FROM public.profiles
WHERE tipo IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 2.2 Agora podemos dropar a coluna 'tipo' com segurança
ALTER TABLE public.profiles DROP COLUMN IF EXISTS tipo;

-- =====================================================
-- PARTE 3: ATUALIZAR POLÍTICAS RLS DE PROFILES
-- =====================================================

-- 3.1 Dropar políticas antigas que causam recursão
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- 3.2 Criar novas políticas sem recursão
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar todos os perfis"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PARTE 4: CORRIGIR POLÍTICAS DE STORAGE
-- =====================================================

-- 4.1 Dropar políticas antigas que causam recursão infinita
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de seus documentos" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem visualizar todos os documentos" ON storage.objects;

-- 4.2 Criar políticas de storage SEM RECURSÃO
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

-- Política para admins (usa função segura)
CREATE POLICY "Admins podem gerenciar todos os documentos"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documentos' AND
    public.has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- PARTE 5: ATUALIZAR FUNÇÕES
-- =====================================================

-- 5.1 Função para obter roles do usuário (substitui get_user_type)
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

-- 5.2 Função para obter role primária (para compatibilidade)
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

-- 5.3 Atualizar função update_user_profile (remover campo tipo)
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
-- PARTE 6: ATUALIZAR TRIGGER DE NOVO USUÁRIO
-- =====================================================

-- 6.1 Atualizar trigger para usar user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (id, nome_completo, telefone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'telefone'
  );
  
  -- Determinar e inserir role
  v_role := COALESCE((NEW.raw_user_meta_data->>'tipo')::app_role, 'investidor'::app_role);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- =====================================================
-- PARTE 7: FUNÇÃO PARA DEFINIR ADMIN
-- =====================================================

-- Função para promover usuário a admin (somente via SQL)
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
-- CONFIGURAÇÃO CONCLUÍDA!
-- =====================================================
-- Próximos passos no SQL Editor:
-- 
-- Para tornar seu usuário admin, execute:
-- SELECT public.set_user_as_admin('SEU-USER-ID-AQUI');
--
-- Para verificar suas roles:
-- SELECT * FROM public.user_roles WHERE user_id = auth.uid();
