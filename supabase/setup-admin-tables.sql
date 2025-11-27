-- Setup Complete: Create all required tables for Admin Panel
-- Run this in the Supabase SQL Editor after the main setup

BEGIN;

-- =====================================================
-- PART 1: Create investimentos table if missing
-- =====================================================
CREATE TABLE IF NOT EXISTS public.investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  valor_minimo NUMERIC,
  retorno_estimado NUMERIC,
  prazo_minimo INTEGER,
  ativo BOOLEAN DEFAULT true,
  imagem TEXT,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for investimentos
ALTER TABLE public.investimentos ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Admin pode ver todos os investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Admin pode criar investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Admin pode atualizar investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Admin pode deletar investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Usuários podem ver investimentos ativos" ON public.investimentos;

-- RLS Policies for investimentos
CREATE POLICY "Admin pode ver todos os investimentos"
  ON public.investimentos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode criar investimentos"
  ON public.investimentos FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode atualizar investimentos"
  ON public.investimentos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode deletar investimentos"
  ON public.investimentos FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem ver investimentos ativos"
  ON public.investimentos FOR SELECT
  USING (ativo = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_investimentos_ativo ON public.investimentos(ativo);
CREATE INDEX IF NOT EXISTS idx_investimentos_categoria ON public.investimentos(categoria);
CREATE INDEX IF NOT EXISTS idx_investimentos_data_criacao ON public.investimentos(data_criacao DESC);

-- =====================================================
-- PART 2: Ensure inscricoes_investimentos table exists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.inscricoes_investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investimento_id UUID NOT NULL REFERENCES public.investimentos(id) ON DELETE CASCADE,
  valor_investido NUMERIC NOT NULL,
  status TEXT DEFAULT 'pendente',
  data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  UNIQUE(usuario_id, investimento_id)
);

-- Enable RLS for inscricoes_investimentos
ALTER TABLE public.inscricoes_investimentos ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Usuários podem ver suas próprias inscrições" ON public.inscricoes_investimentos;
DROP POLICY IF EXISTS "Admin pode ver todas as inscrições" ON public.inscricoes_investimentos;
DROP POLICY IF EXISTS "Usuários podem criar inscrições" ON public.inscricoes_investimentos;

-- RLS Policies
CREATE POLICY "Usuários podem ver suas próprias inscrições"
  ON public.inscricoes_investimentos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Admin pode ver todas as inscrições"
  ON public.inscricoes_investimentos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem criar inscrições"
  ON public.inscricoes_investimentos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inscricoes_usuario_id ON public.inscricoes_investimentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_investimento_id ON public.inscricoes_investimentos(investimento_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON public.inscricoes_investimentos(status);

-- =====================================================
-- PART 3: Add status column to profiles if missing
-- =====================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativo';

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- =====================================================
-- PART 4: Create users_by_role view (if not exists)
-- =====================================================
DROP VIEW IF EXISTS public.users_by_role CASCADE;

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
  p.status,
  p.data_criacao,
  p.updated_at,
  p.documento_frente,
  p.documento_verso,
  COALESCE(
    (SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY CASE ur.role WHEN 'admin' THEN 1 WHEN 'parceiro' THEN 2 ELSE 3 END LIMIT 1),
    'investidor'::app_role
  ) AS tipo
FROM public.profiles p;

-- =====================================================
-- PART 5: Create indexes for user_roles if missing
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- =====================================================
-- PART 5: Create ENUM for colocação dos investimentos
-- =====================================================
-- Corrigir criação do ENUM (Postgres não tem IF NOT EXISTS para TYPE)
DROP TYPE IF EXISTS public.colocacao_investimento CASCADE;

CREATE TYPE public.colocacao_investimento AS ENUM (
  'oportunidades',
  'destaque',
  'pagina_inicial'
);

-- Add colocacao column (placement) and keep 'featured' for backward compatibility
ALTER TABLE public.investimentos
  ADD COLUMN IF NOT EXISTS colocacao public.colocacao_investimento DEFAULT 'oportunidades';

-- If older 'featured' column exists, migrate its true values to colocacao = 'destaque'
ALTER TABLE public.investimentos
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

UPDATE public.investimentos SET colocacao = 'destaque' WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_investimentos_colocacao ON public.investimentos(colocacao);

-- =====================================================
-- PART 6: Create notifications table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  lido BOOLEAN DEFAULT false,
  relacionada_a TEXT,
  investimento_id UUID REFERENCES public.investimentos(id) ON DELETE SET NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_leitura TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admin pode criar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas notificações" ON public.notifications;

-- RLS Policies for notifications
CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON public.notifications FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Admin pode criar notificações"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem atualizar suas notificações"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_usuario_id ON public.notifications(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lido ON public.notifications(lido);
CREATE INDEX IF NOT EXISTS idx_notifications_data_criacao ON public.notifications(data_criacao DESC);

COMMIT;

-- Notes:
-- - This script is idempotent (safe to run multiple times)
-- - Creates all required tables for Admin Panel
-- - Adds RLS policies for security
-- - Creates performance indexes
-- - Run this before using AdminInvestments, AdminPartners, AdminInvestors components
