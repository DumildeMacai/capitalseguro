# Setup Final - Admin Panel & Email Sync

## 📋 Próximos Passos (Executar no Supabase SQL Editor)

### 0️⃣ **Setup: Criar todas as tabelas necessárias** ⚠️ EXECUTAR PRIMEIRO

Copie e cole no SQL Editor do Supabase:

```sql
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

COMMIT;
```

**O que faz:**
- ✅ Cria tabela `investimentos` com RLS policies
- ✅ Garante tabela `inscricoes_investimentos` existe
- ✅ Adiciona coluna `status` em `profiles`
- ✅ Cria view `users_by_role` para queries sem coluna `tipo`
- ✅ Cria indexes para performance

---

### 1️⃣ **Migração: Adicionar coluna `email` em profiles**

Copie e cole no SQL Editor do Supabase:

```sql
-- Migration: Add email column to profiles and sync with auth.users
-- Run this in the Supabase SQL Editor (or psql connected to your DB).

BEGIN;

-- 1) Add column if missing
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 2) Populate existing rows from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.id
  AND (p.email IS NULL OR p.email = '');

-- 3) Replace handle_new_user trigger function to populate email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, tipo, nome_completo, telefone, email)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tipo')::user_type, 'investidor'),
    NEW.raw_user_meta_data->>'nome',
    NEW.raw_user_meta_data->>'telefone',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4) Recreate trigger to ensure it points to the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5) Create sync function to propagate email updates
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email();

COMMIT;
```

**O que faz:**
- ✅ Adiciona coluna `email` em `profiles` (se não existir)
- ✅ Popula com dados existentes de `auth.users`
- ✅ Atualiza trigger para novos registros
- ✅ Cria sincronização para updates de email

---

### 2️⃣ **View: Criar users_by_role para queries sem `tipo`** (Opcional - Já incluído no Setup)

---

## ✅ O que foi implementado

### Admin Dashboard - CRUD Completo

#### 📊 **AdminOverview**
- Estatísticas dinâmicas: investidores, parceiros, total investido, investimentos ativos
- Gráficos por categoria
- Resumo de atividades

#### 💼 **AdminInvestments**
- ✅ Criar novo investimento (modal)
- ✅ Editar investimento existente
- ✅ Visualizar detalhes
- ✅ Excluir com confirmação
- Busca e filtro por título/categoria

#### 🤝 **AdminPartners**
- ✅ Criar/Editar dados do parceiro
- ✅ Validar Documentos (menu)
- ✅ Aprovar parceiros (pendentes)
- ✅ Rejeitar parceiros (pendentes)
- ✅ Notificar via modal
- ✅ Excluir com confirmação
- Busca por nome, empresa, email

#### 👥 **AdminInvestors**
- ✅ Visualizar/Editar dados
- ✅ Suspender/Ativar investidor
- ✅ Notificar com mensagem
- Status: Ativo/Suspenso
- Busca em tempo real

---

## 🚀 Como testar

1. **Executar o script de Setup (0️⃣)** no Supabase SQL Editor - PRIMEIRO
2. **Executar a Migração de Email (1️⃣)** no Supabase SQL Editor
3. **Recarregar a aplicação**
4. **Acessar Admin Dashboard** (se logado como admin)
5. **Testar cada seção:**
   - Overview: Deve mostrar estatísticas reais
   - Investments: Criar/editar/deletar
   - Partners: Aprovar/rejeitar/notificar
   - Investors: Visualizar/suspender/notificar

---

## 📝 Notas

- ✅ Coluna `email` em `profiles` é sincronizada automaticamente
- ✅ View `users_by_role` sempre retorna um tipo (padrão: investidor)
- ✅ RLS policies protegem dados sensíveis
- ✅ Admin pode realizar todas as operações
- ⚠️ Notificações são apenas UI por enquanto (integração com email service futura)

---

## 📂 Arquivos criados/modificados

**Supabase:**
- `supabase/setup-admin-tables.sql` - Setup completo de tabelas (EXECUTAR PRIMEIRO)
- `supabase/migrate-add-email-to-profiles.sql` - Adicionar email e triggers
- `supabase/create-user-profiles-view.sql` - View users_by_role (incluído no setup-admin-tables.sql)

**React Components:**
- `src/components/AdminInvestments.tsx` - CRUD investimentos
- `src/components/AdminPartners.tsx` - Gerenciamento parceiros
- `src/components/AdminInvestors.tsx` - Gerenciamento investidores
- `src/components/AdminOverview.tsx` - Dashboard com stats reais

---

## ✨ Commits

- `747da8f` - feat: implementar CRUD completo para Admin
- `e1eef74` - fix: usar view users_by_role (resolve erro profiles.tipo)
- `4200610` - docs: guia final de setup do Admin Panel
