# Setup Final - Admin Panel & Email Sync

## 📋 Próximos Passos (Executar no Supabase SQL Editor)

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

### 2️⃣ **View: Criar users_by_role para queries sem `tipo`**

Copie e cole no SQL Editor do Supabase:

```sql
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
```

**O que faz:**
- ✅ Cria view `users_by_role` que junta `profiles` + `user_roles`
- ✅ Permite filtrar por `tipo` sem a coluna removida
- ✅ Adiciona indexes para performance

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

1. **Executar as 2 migrações SQL** acima no Supabase SQL Editor
2. **Recarregar a aplicação**
3. **Acessar Admin Dashboard** (se logado como admin)
4. **Testar cada seção:**
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
- `supabase/migrate-add-email-to-profiles.sql` - Adicionar email e triggers
- `supabase/create-user-profiles-view.sql` - View users_by_role

**React Components:**
- `src/components/AdminInvestments.tsx` - CRUD investimentos
- `src/components/AdminPartners.tsx` - Gerenciamento parceiros
- `src/components/AdminInvestors.tsx` - Gerenciamento investidores
- `src/components/AdminOverview.tsx` - Dashboard com stats reais

---

## ✨ Commits

- `747da8f` - feat: implementar CRUD completo para Admin
- `e1eef74` - fix: usar view users_by_role (resolve erro profiles.tipo)
