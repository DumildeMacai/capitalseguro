# ✅ Diagnóstico & Solução - Admin Routing Issue

## 🔴 Problema Identificado

Admin user estava sendo redirecionado para `/investidor` em vez de `/admin` após login.

**Root Cause**: A RPC `get_user_type()` busca o role do usuário na tabela `public.user_roles`, não em `profiles.tipo`.

```
Fluxo Anterior (Quebrado):
┌─────────────────────────────────────────┐
│ 1. User clicks "Admin Button"           │
├─────────────────────────────────────────┤
│ 2. handleAdminAccess() runs             │
│    - ✅ Auth succeeds                   │
│    - ✅ profiles.upsert() runs          │
│      (mas tipo era desconsiderado!)     │
│    - ❌ user_roles NÃO é criada         │
├─────────────────────────────────────────┤
│ 3. fetchUserType() chamado              │
│    - RPC busca em user_roles            │
│    - Nada encontrado                    │
│    - Retorna null → padrão = investidor │
├─────────────────────────────────────────┤
│ 4. ProtectedRoute redireciona           │
│    - userType = investidor              │
│    - Redireciona para /investidor ❌    │
└─────────────────────────────────────────┘
```

## 🟢 Solução Implementada

### Mudança 1: Código TypeScript (`src/utils/authHelpers.ts`)

Adicionado bloco para criar role em `user_roles`:

```typescript
// Step 2.5: Create admin role in user_roles table
console.log("[Admin Access] Creating admin role in user_roles...")
const { error: roleError } = await supabase
  .from("user_roles")
  .upsert(
    {
      user_id: user.id,
      role: "admin",
    },
    { onConflict: "user_id" }
  )

if (roleError) {
  console.warn("[Admin Access] Role upsert warning:", roleError.message)
}
```

### Mudança 2: Script SQL (`supabase/fix-admin-user.sql`)

Para executar **uma única vez** no Supabase para corrigir dados existentes:

```sql
-- Garantir perfil admin existe
INSERT INTO public.profiles (id, nome_completo, bio, created_at, updated_at)
SELECT u.id, 'Administrador', 'Conta administrativa do sistema', NOW(), NOW()
FROM auth.users u WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Limpar outras roles e criar admin role
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@admin.com' LIMIT 1);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u WHERE u.email = 'admin@admin.com';
```

## 📊 Novo Fluxo (Correto)

```
┌─────────────────────────────────────────┐
│ 1. User clicks "Admin Button"           │
├─────────────────────────────────────────┤
│ 2. handleAdminAccess() runs             │
│    ✅ Auth succeeds                     │
│    ✅ profiles.upsert() executa         │
│    ✅ user_roles.upsert() executa ← NEW │
│       (cria role='admin')               │
├─────────────────────────────────────────┤
│ 3. fetchUserType() chamado              │
│    ✅ RPC busca em user_roles           │
│    ✅ Encontra role='admin'             │
│    ✅ Retorna 'admin'                   │
├─────────────────────────────────────────┤
│ 4. ProtectedRoute redireciona           │
│    ✅ userType = 'admin'                │
│    ✅ Redireciona para /admin ✅        │
└─────────────────────────────────────────┘
```

## 🔧 O Que Fazer Agora

### Passo 1: Executar SQL (OBRIGATÓRIO)
1. Abra Supabase Dashboard
2. Vá para **SQL Editor**
3. Copie/execute o script em `supabase/fix-admin-user.sql`
4. Confirme que apareceu: `role = 'admin'` nos resultados

### Passo 2: Testar
1. Limpe cookies/cache do navegador (Ctrl+Shift+Del)
2. Abra o app em modo incógnito (melhor para teste)
3. Clique em "🔐 Acesso Admin (Demo)"
4. Você deve ir para `/admin` ✅

### Passo 3: Verificar Logs
No console do navegador (F12), você verá:
```
[Admin Access] Starting smart admin sign-up/sign-in flow...
[Admin Access] Upserting admin profile...
[Admin Access] Creating admin role in user_roles...
[ProtectedRoute] User: admin@admin.com, UserType: admin, Required: admin
```

## 📋 Arquivos Modificados

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `src/utils/authHelpers.ts` | Adicionado upsert em `user_roles` | ✅ Commitado |
| `supabase/fix-admin-user.sql` | Script para corrigir dados | ✅ Criado |
| `FIX-ADMIN-ROUTING.md` | Documentação da solução | ✅ Criado |

## 🎯 Arquitetura de Roles

```
Supabase Auth (Autenticação)
    ↓ user.id
    ├── auth.users (email, password_hash, etc)
    ├── public.profiles (nome_completo, bio, avatar, etc)
    │   [NÃO contém tipo/role - apenas dados do perfil]
    │
    └── public.user_roles (user_id, role)
        ├── admin
        ├── parceiro
        └── investidor
            ↓
            RPC: get_user_type(user_id)
            ↓
            ProtectedRoute (validação & redirecionamento)
            ↓
            /admin, /investidor, /parceiro
```

## ❓ Troubleshooting

**Problema**: Admin ainda vai para `/investidor`
- [ ] Verifique se executou o SQL
- [ ] Limpe cookies (não apenas cache)
- [ ] Abra em modo incógnito
- [ ] Verifique no Supabase: Database > user_roles > procure "admin@admin.com"

**Problema**: Erro ao executar SQL
- Verifique nome exato da tabela: `public.user_roles`
- Verifique tipo de enum: `app_role` (não `user_type`)
- Tente deletar/reinsertar manualmente

**Problema**: RPC retorna erro
- Verifique se existe a função `get_user_type` no Supabase
- Verifique se a função tem `SECURITY DEFINER` (precisa de permissão)

---

**Commit**: `3ad94df` - fix: ensure admin role is created in user_roles table  
**Próximo Step**: Executar SQL no Supabase SQL Editor
