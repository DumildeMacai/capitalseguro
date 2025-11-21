-- ==================================================
-- SCRIPT DE CONFIGURAÇÃO DO NOVO BACKEND SUPABASE
-- ==================================================
-- Execute este script no SQL Editor do seu novo projeto Supabase
-- (https://supabase.com/dashboard/project/xmemmdmyzwimluvgiqal/sql/new)

-- 1. Criar enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('admin', 'investidor', 'parceiro');

-- 2. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo user_type NOT NULL DEFAULT 'investidor',
  nome_completo TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  provincia TEXT,
  bio TEXT,
  documento_frente TEXT,
  documento_verso TEXT,
  empresa_nome TEXT,
  ramo_negocio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- 5. Função para obter tipo de usuário
CREATE OR REPLACE FUNCTION public.get_user_type(user_id UUID)
RETURNS user_type
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_type user_type;
BEGIN
  SELECT tipo INTO v_user_type
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN v_user_type;
END;
$$;

-- 6. Função para atualizar perfil do usuário
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

-- 7. Trigger para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, tipo, nome_completo, telefone)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tipo')::user_type, 'investidor'),
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'telefone'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Criar bucket de storage para documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'Documentos de identidade',
  false,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 9. Políticas de storage para documentos
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

CREATE POLICY "Admins podem visualizar todos os documentos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documentos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- ==================================================
-- CONFIGURAÇÃO CONCLUÍDA!
-- ==================================================
-- Próximos passos:
-- 1. Vá em Authentication > URL Configuration
-- 2. Configure o Site URL para seu domínio (ex: https://seu-projeto.lovable.app)
-- 3. Adicione Redirect URLs permitidas (mesmo URL do Site URL)
-- 4. Em Authentication > Providers > Email, desabilite "Confirm email" para testar mais rápido
