# 🔧 ADMIN SETUP - Guia Completo de Correção

## Estado Atual do Problema

O erro que você está vendo (`401 Unauthorized`, `role "admin" does not exist`) indica que:

1. **O arquivo SQL de setup (`fix-security-and-storage.sql`) NÃO foi executado completamente no Supabase**, ou
2. **O enum `app_role` não foi criado com sucesso**, ou
3. **As tabelas/funções não estão sincronizadas**

## Solução em 3 Passos

### ✅ Passo 1: Executar SQL de Setup Completo

**IMPORTANTE**: Execute TODOS os scripts SQL nesta ordem no Supabase SQL Editor:

#### 1.1 Script Principal (fix-security-and-storage.sql)
```
📁 supabase/fix-security-and-storage.sql
```

**Como executar:**
1. Abra https://supabase.com/dashboard
2. Seu projeto (xmemmdmyzwimluvgiqal)
3. SQL Editor → **Create new query**
4. Copie **TODO** o conteúdo de `/supabase/fix-security-and-storage.sql`
5. Clique **Run**
6. **Aguarde até terminar completamente** (pode levar 1-2 minutos)

#### 1.2 Script de Função (fix-set-user-as-admin.sql)
```
📁 supabase/fix-set-user-as-admin.sql
```

**Como executar:**
1. Mesmo SQL Editor
2. **Create new query** novamente
3. Copie **TODO** o conteúdo de `/supabase/fix-set-user-as-admin.sql`
4. Clique **Run**

### ✅ Passo 2: Verificar Estrutura no Supabase

Após executar os scripts, verifique se tudo foi criado:

**No SQL Editor, execute cada query abaixo e confirme os resultados:**

#### 2.1 Verificar enum app_role
```sql
SELECT enum_name, enum_values FROM information_schema.enums 
WHERE enum_name = 'app_role';
```
**Esperado:** Uma linha com `app_role` e valores `admin`, `parceiro`, `investidor`

#### 2.2 Verificar tabela user_roles
```sql
SELECT * FROM public.user_roles LIMIT 1;
```
**Esperado:** Tabela existe (mesmo que vazia)

#### 2.3 Verificar funções RPC
```sql
SELECT p.proname, pg_get_function_arguments(p.oid) 
FROM pg_proc p
WHERE proname IN ('get_user_type', 'set_user_as_admin_by_email', 'has_role');
```
**Esperado:** Todas as 3 funções aparecerem

#### 2.4 Verificar trigger
```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```
**Esperado:** Uma linha com o trigger

### ✅ Passo 3: Criar o Admin User

**Execute no SQL Editor:**

```sql
-- Verificar se admin existe
SELECT id, email FROM auth.users WHERE email = 'admin@admin.com';

-- Se NÃO existe, criar (EXECUTE COMO ADMIN NO SUPABASE DASHBOARD):
-- (Você não pode criar users via SQL, precisa usar o Dashboard)
-- 1. Abra https://supabase.com/dashboard/project/xmemmdmyzwimluvgiqal/auth/users
-- 2. Clique "Add user" ou "Invite user"
-- 3. Email: admin@admin.com
-- 4. Password: 1dumilde1@A
-- 5. Clique "Send invite" ou "Create user"

-- Depois que o user existir, promova-o a admin:
SELECT * FROM public.set_user_as_admin_by_email('admin@admin.com');
-- Esperado: success=true, com o user_id do admin
```

## Diagrama de Fluxo Após Fix

```
┌─────────────────────────────────────────────────┐
│ 1. User clica "🔐 Acesso Admin (Demo)"          │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. handleAdminAccess() em authHelpers.ts        │
│    ✅ Tenta SignUp (ou fallback SignIn)         │
│    ✅ Trigger handle_new_user() cria:           │
│       - profiles row                            │
│       - user_roles row (role='investidor' padrão)│
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. RPC set_user_as_admin_by_email() chamada     │
│    ✅ Promove user para role='admin'            │
│    (Se falhar, continua mesmo assim)            │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. fetchUserType() chamada                      │
│    ✅ RPC get_user_type() busca em user_roles   │
│    ✅ Retorna 'admin'                           │
│    ✅ Redirect para /admin                      │
└─────────────────────────────────────────────────┘
```

## Debugging: Se Ainda Não Funcionar

### Erro: "role 'admin' does not exist"
- **Causa**: Enum `app_role` não foi criado
- **Solução**: Execute `fix-security-and-storage.sql` novamente, verificando se completa sem erros

### Erro: 401 Unauthorized em RPC
- **Causa**: Problema de RLS ou função não criada com `SECURITY DEFINER`
- **Solução**: Execute `fix-set-user-as-admin.sql` para garantir que a função existe

### Admin não é redirecionado para /admin
- **Causa**: `user_roles` tabela não tem a entrada com role='admin'
- **Solução**: Execute no SQL Editor:
```sql
-- Verifique quem é o admin
SELECT id FROM auth.users WHERE email = 'admin@admin.com';

-- Substitua USER_ID_HERE pelo ID retornado acima e execute:
SELECT * FROM public.set_user_as_admin_by_email('admin@admin.com');

-- Confirme que foi criada:
SELECT * FROM public.user_roles WHERE user_id = 'USER_ID_HERE'::uuid;
-- Esperado: Uma linha com role='admin'
```

### Teste Manual no Console (F12)
```javascript
// Copie e execute no console do navegador:
const { data, error } = await supabase.rpc('get_user_type', { 
  user_id: 'ADMIN_USER_ID_HERE' 
});
console.log('User type:', data);
console.log('Error:', error);
// Esperado: data = 'admin', error = null
```

## Checklist de Verificação

- [ ] Enum `app_role` criado com valores (admin, parceiro, investidor)
- [ ] Tabela `public.user_roles` existe
- [ ] Trigger `on_auth_user_created` existe
- [ ] RPC `get_user_type()` existe e funciona
- [ ] RPC `set_user_as_admin_by_email()` existe e funciona
- [ ] Admin user existe em auth.users
- [ ] Admin user tem row em public.profiles
- [ ] Admin user tem role='admin' em public.user_roles
- [ ] Ao clicar "Admin Button", consegue acessar /admin

## Próximas Etapas

1. **Execute os scripts SQL** (Passos 1 e 2)
2. **Verifique a estrutura** (Passo 2 - Verificações)
3. **Crie/promova admin user** (Passo 3)
4. **Teste o fluxo** (clique no botão admin e acesse /admin)
5. **Se não funcionar**, rode os testes de debugging acima

## Documentação Relacionada

- `ADMIN-FIX-SUMMARY.md` - Análise técnica do problema
- `FIX-ADMIN-ROUTING.md` - Detalhes da arquitetura
- `admin-fix-status.json` - Status e checklist em JSON

---

**Última atualização**: 27/11/2025  
**Commit**: f9d785c - Melhoria de error handling e RPC fallback
