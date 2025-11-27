# Guia de Correção - Admin Redirection Issue

## Problema Identificado

A RPC `get_user_type()` busca o role do usuário na tabela `public.user_roles`, não na tabela `profiles`. 

O código anterior tentava apenas atualizar `profiles.tipo`, mas isso não criava/atualizava a entrada correspondente em `user_roles`. Resultado: `get_user_type()` retornava `null` ou `'investidor'` (padrão), causando redirecionamento errado.

## Solução - 2 Passos

### Passo 1: Executar SQL no Supabase

Copie e execute este script no **SQL Editor** do Supabase (Dashboard > SQL Editor > Create new query):

```sql
-- Fix Admin User Type and Role
-- Garante que o usuário admin tem role 'admin' em user_roles

-- Passo 1: Garantir perfil admin existe
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

-- Passo 2: Remover outras roles e garantir role='admin'
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@admin.com' LIMIT 1);

INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'admin'::app_role
FROM auth.users u
WHERE u.email = 'admin@admin.com';

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
```

**O que fazer:**
1. Abra seu Supabase Dashboard
2. Vá para **SQL Editor**
3. Clique em **Create new query**
4. Cole o script acima
5. Clique em **Run**
6. Você deve ver uma linha com `role = admin` na tabela de resultados

### Passo 2: Código TypeScript Já Atualizado

O código em `src/utils/authHelpers.ts` já foi atualizado para:
- Remover `tipo: "admin"` do upsert em `profiles` (campo não mais usado ali)
- Adicionar upsert em `user_roles` com `role: "admin"`

As mudanças já estão no arquivo. Apenas é necessário executar o SQL do Passo 1.

## Testes Após Correção

1. **Limpar cookies do navegador** (ou abrir em modo incógnito)
2. Abrir: https://seu-app-url/login
3. Clicar no botão **"🔐 Acesso Admin (Demo)"**
4. Você deve ser redirecionado para `/admin` (não `/investidor`)
5. Nos logs do console, você verá:
   ```
   [Admin Access] Starting smart admin sign-up/sign-in flow...
   [Admin Access] Upserting admin profile...
   [Admin Access] Creating admin role in user_roles...
   [ProtectedRoute] User: admin@admin.com, UserType: admin, Required: admin
   ```

## Se Ainda Não Funcionar

Se o admin ainda for redirecionado para `/investidor`:

1. **Verifique no console do navegador (F12)**:
   - Veja se os logs acima aparecem
   - Se disser "UserType: admin" mas ainda redireciona, o problema pode ser no ProtectedRoute

2. **Verifique no Supabase Dashboard**:
   - Vá para **Database > user_roles**
   - Procure por email = `admin@admin.com`
   - Confirme se `role = 'admin'`

3. **Limpe cache/cookies**:
   ```bash
   # Feche o navegador completamente e abra novamente
   # Ou pressione Ctrl+Shift+Del para limpar dados de navegação
   ```

## Resumo da Arquitetura

```
auth.users (Supabase Auth)
    ↓
    ├── profiles (dados adicionais: nome, bio, etc)
    └── user_roles (roles/tipos: admin, parceiro, investidor)
          ↓
          RPC get_user_type(user_id)
          ↓
          ProtectedRoute (rota baseada em userType)
          ↓
          /admin, /investidor, /parceiro
```

---

**Arquivo corrigido**: `/workspaces/capitalseguro/src/utils/authHelpers.ts`  
**Script SQL criado**: `/workspaces/capitalseguro/supabase/fix-admin-user.sql`
