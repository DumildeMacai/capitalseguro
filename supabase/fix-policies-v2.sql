-- ==================================================
-- CORREÇÃO COMPLETA DE POLÍTICAS RLS E STORAGE
-- ==================================================
-- Execute este script no SQL Editor do Supabase
-- Resolve: recursão infinita, schema inválido, storage

/* =====================================================
   PARTE 1: LIMPAR TODAS AS POLÍTICAS PROBLEMÁTICAS
   ===================================================== */

-- Remover políticas problemáticas de storage
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de seus documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os documentos" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem visualizar todos os documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de seus avatares" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem ver todos os documentos" ON storage.objects;

-- Remover políticas de profiles
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON public.profiles;

/* =====================================================
   PARTE 1.5: CRIAR TABELA USER_ROLES (SE NÃO EXISTIR)
   ===================================================== */

-- Criar enum para roles
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'parceiro', 'investidor');

-- Criar tabela user_roles
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

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Políticas RLS para user_roles (temporárias, até funções estarem prontas)
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_service_role"
  ON public.user_roles
  USING (current_user = 'service_role')
  WITH CHECK (current_user = 'service_role');

/* =====================================================
   PARTE 2: GARANTIR FUNÇÃO SEGURA SEM RECURSÃO
   ===================================================== */

-- Criar função para verificar admin (usando user_roles)
DROP FUNCTION IF EXISTS public.is_admin(_user_id UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
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
      AND role = 'admin'
  );
$$;

-- Criar função para verificar se tem role
DROP FUNCTION IF EXISTS public.has_role(_user_id UUID, _role text) CASCADE;
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role text)
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
      AND role::text = _role
  );
$$;

/* =====================================================
   PARTE 2.5: POLÍTICAS RLS COMPLETAS PARA USER_ROLES
   ===================================================== */

-- Remover políticas antigas de user_roles
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_service_role" ON public.user_roles;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem ver todas as roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem inserir roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem atualizar roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem deletar roles" ON public.user_roles;

-- Novas políticas para user_roles
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_select_admin"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_insert_admin"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_delete_admin"
  ON public.user_roles FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_service_role"
  ON public.user_roles
  USING (current_user = 'service_role')
  WITH CHECK (current_user = 'service_role');

/* =====================================================
   PARTE 4: RECRIAR POLÍTICAS RLS PARA PROFILES
   ===================================================== */

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seu próprio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis (sem recursão!)
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins podem atualizar qualquer perfil
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Permitir INSERT para auth.uid() = id (para auto-criação de perfil)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role pode fazer qualquer coisa (para migrations)
CREATE POLICY "profiles_service_role"
  ON public.profiles
  USING (current_user = 'service_role')
  WITH CHECK (current_user = 'service_role');

/* =====================================================
   PARTE 5: RECRIAR POLÍTICAS DE STORAGE (SEM RECURSÃO)
   ===================================================== */

-- Usuários podem ver seus próprios arquivos
CREATE POLICY "storage_select_own"
  ON storage.objects FOR SELECT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Usuários podem fazer upload dos seus próprios arquivos
CREATE POLICY "storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Usuários podem atualizar seus próprios arquivos
CREATE POLICY "storage_update_own"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Usuários podem deletar seus próprios arquivos
CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Admins podem ver todos os arquivos (sem recursão!)
CREATE POLICY "storage_select_admin"
  ON storage.objects FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Service role pode fazer qualquer coisa
CREATE POLICY "storage_service_role"
  ON storage.objects
  USING (current_user = 'service_role')
  WITH CHECK (current_user = 'service_role');

/* =====================================================
   PARTE 6: CRIAR FUNÇÃO PARA AUTO-CRIAR PERFIL
   ===================================================== */

-- Função para criar perfil automaticamente após signup
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil básico
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  
  -- Se tipo foi passado nos metadados, criar role correspondente
  IF NEW.raw_user_meta_data->>'tipo' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'tipo')::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para auto-criar perfil
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users CASCADE;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_profile();

/* =====================================================
   PARTE 7: VERIFICAÇÃO FINAL
   ===================================================== */

-- Verificar que as políticas estão corretas
SELECT 
  tablename,
  policyname,
  qual,
  with_check,
  permissive
FROM pg_policies
WHERE tablename IN ('profiles', 'objects')
ORDER BY tablename, policyname;
