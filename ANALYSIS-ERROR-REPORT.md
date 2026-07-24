# 📊 Análise Completa de Erros e Incompatibilidades - Capital Seguro

**Data da Análise:** 2026-07-24  
**Status:** ⚠️ Crítico - Vários problemas de schema encontrados

---

## 🔴 ERROS CRÍTICOS (Bloqueiam Funcionalidade)

### 1. **Missing RPC Function: `get_user_type`**
- **Arquivo:** `src/hooks/useUserRoles.ts:18`
- **Problema:** Chamando `supabase.rpc('get_user_type', { user_id })` mas a função não existe
- **Impacto:** ❌ `useAuthState()` não consegue determinar o tipo de usuário
- **Afeta:** Todo o sistema de autenticação e autorização
- **Solução:** Criar função RPC que obtém a role do usuário de `user_roles` table

**Código problemático:**
```typescript
const { data, error } = await supabase
  .rpc('get_user_type', { user_id: userId });
```

**Deve ser:**
```sql
CREATE OR REPLACE FUNCTION public.get_user_type(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;
```

---

### 2. **Invalid Column References in Profile Updates**
- **Arquivo:** `src/utils/registerUtils.ts:145-150`
- **Problema:** Tentando atualizar colunas que não existem ou foram movidas
- **Impacto:** ❌ Profile updates falham durante registro
- **Afetados:**
  - ❌ `documento_url` - Não existe (documentos estão em storage)
  - ⚠️ `pais` - Deve ser `provincia`
  
**Código problemático:**
```typescript
const { error } = await supabase
  .from("profiles")
  .update({
    nome_completo: values.name,
    telefone: values.phone,
    endereco: values.address,
    cidade: values.city,
    pais: values.province || "Angola",  // ❌ Coluna errada
    bio: values.bio || '',
    documento_url: files.biFront ? `${userId}/bi_frente` : null,  // ❌ Campo não existe
    empresa_nome: values.userType === 'parceiro' ? values.name : null,
  })
```

**Solução:**
```typescript
const { error } = await supabase
  .from("profiles")
  .update({
    nome_completo: values.name,
    telefone: values.phone,
    endereco: values.address,
    cidade: values.city,
    provincia: values.province || "Angola",  // ✅ Nome correto
    bio: values.bio || '',
    // ✅ Remove documento_url - documentos estão em storage
    empresa_nome: values.userType === 'parceiro' ? values.company : null,
  })
```

---

### 3. **AdminInvestors Component - Invalid Field Mappings**
- **Arquivo:** `src/components/AdminInvestors.tsx:93-104`
- **Problema:** Referenciando colunas que não existem
- **Impacto:** ❌ Admin não consegue carregar lista de investidores
- **Campos problemáticos:**
  - ❌ `full_name` - Não existe (deve ser `nome_completo`)
  - ❌ `username` - Não existe
  - ❌ `phone` - Não existe (deve ser `telefone`)
  - ❌ `data_inscricao` - Não existe (deve ser `created_at`)
  - ❌ `saldo_disponivel` - Não existe

**Código problemático:**
```typescript
const mappedData = (data || []).map((p: any) => ({
  id: p.id,
  nome_completo: p.nome_completo || p.full_name || p.username || "—",  // ❌ Colunas erradas
  email: p.email || "—",
  telefone: p.telefone || p.phone || "—",  // ❌ `phone` não existe
  bio: p.bio || "",
  data_criacao: p.created_at || p.data_criacao || p.data_inscricao,  // ⚠️ Confuso
  saldo_disponivel: Number(p.saldo_disponivel || 0)  // ❌ Não existe
}));
```

---

## ⚠️ ERROS IMPORTANTES (Podem causar falhas)

### 4. **AdminUsers Component - Upsert Syntax Issue**
- **Arquivo:** `src/components/AdminUsers.tsx:87-90`
- **Problema:** Usando `onConflict` incorretamente com upsert
- **Impacto:** ⚠️ Adicionar admin role pode falhar
- **Código:**
```typescript
const { error } = await supabase
  .from('user_roles')
  .upsert(
    { user_id: userId, role: 'admin' },
    { onConflict: 'user_id,role' }  // ⚠️ Sintaxe não suportada
  );
```

**Solução:**
```typescript
const { error } = await supabase
  .from('user_roles')
  .upsert(
    { user_id: userId, role: 'admin' }
  );
```

---

### 5. **Missing User Email in Admin Queries**
- **Arquivo:** `src/components/AdminInvestors.tsx` e `AdminPartners.tsx`
- **Problema:** Tentando buscar `email` da tabela `profiles`, mas emails estão apenas em `auth.users`
- **Impacto:** ⚠️ Emails não são carregados sem chamada separada ao auth API
- **Solução:** Adicionar fallback ou buscar via API separada

---

### 6. **Storage Upload Path Inconsistency**
- **Arquivo:** `src/utils/registerUtils.ts:121-127`
- **Problema:** Usando caminho sem UUID único (pode sobrescrever arquivos)
- **Código:**
```typescript
await uploadDocumentWithoutAuth('documentos', `${userId}/bi_frente`, files.biFront);
// ⚠️ Próximo upload sobrescreve arquivo anterior
```

**Solução:** Usar UUID (já implementado em `src/services/storage.ts`)
```typescript
const ext = file.name.split('.').pop();
const filePath = `${userId}/bi_frente_${Date.now()}.${ext}`;  // ✅ Único
```

---

## 📋 INCOMPATIBILIDADES DE SCHEMA

### Tabela `profiles` - Campos Atuais vs. Esperados

| Campo | Esperado | Real | Status |
|-------|----------|------|--------|
| `id` | UUID | UUID | ✅ OK |
| `nome_completo` | ✅ | ✅ | ✅ OK |
| `telefone` | ✅ | ✅ | ✅ OK |
| `endereco` | ✅ | ✅ | ✅ OK |
| `cidade` | ✅ | ✅ | ✅ OK |
| `pais` | ❌ Não existe | Não existe | ⚠️ Use `provincia` |
| `provincia` | ✅ | ✅ | ✅ OK |
| `bio` | ✅ | ✅ | ✅ OK |
| `documento_url` | ❌ Não deve existir | - | ❌ Remove em código |
| `documento_frente` | ❌ Deprecado | - | ❌ Use storage |
| `documento_verso` | ❌ Deprecado | - | ❌ Use storage |
| `empresa_nome` | ✅ | ✅ | ✅ OK |
| `ramo_negocio` | ✅ | ✅ | ✅ OK |
| `is_admin` | ❌ Deprecado | - | ❌ Use `user_roles` |
| `tipo` | ❌ Deprecado | - | ❌ Use `user_roles` |
| `email` | ❌ Não existe | - | ⚠️ Em `auth.users` |
| `saldo_disponivel` | ❌ Não existe | - | ❌ Não implementado |
| `created_at` | ✅ | ✅ | ✅ OK |
| `updated_at` | ✅ | ✅ | ✅ OK |

---

## 🔧 PLANO DE CORREÇÃO

### Prioridade 1: CRÍTICA (Faz funcionar)
- [ ] Criar função RPC `get_user_type` 
- [ ] Corrigir referências de colunas em `registerUtils.ts`
- [ ] Corrigir mapeamento de campos em `AdminInvestors.tsx`

### Prioridade 2: IMPORTANTE (Melhora UX)
- [ ] Adicionar fallback para emails do admin
- [ ] Corrigir sintaxe upsert em AdminUsers
- [ ] Adicionar UUID único nos uploads

### Prioridade 3: NICE-TO-HAVE (Melhora código)
- [ ] Remover campos deprecados de todas referências
- [ ] Criar tipos TypeScript para `profiles` baseado no schema real
- [ ] Adicionar validações de schema

---

## 📂 Arquivos Afetados

1. `src/hooks/useUserRoles.ts` - ❌ Crítico
2. `src/utils/registerUtils.ts` - ❌ Crítico  
3. `src/components/AdminInvestors.tsx` - ❌ Crítico
4. `src/components/AdminUsers.tsx` - ⚠️ Importante
5. `src/services/auth.ts` - ✅ Já corrigido
6. `src/components/profile/UploadAvatar.tsx` - ✅ Já corrigido

---

## 🚀 Próximos Passos

1. **Executar SQL para criar `get_user_type` RPC**
2. **Atualizar `registerUtils.ts` com nomes corretos de colunas**
3. **Corrigir `AdminInvestors.tsx` para mapear campos corretos**
4. **Testar fluxo completo:**
   - Registro de novo usuário
   - Login
   - Acesso ao painel admin
   - Verificação de usuários

---

**Gerado em:** 2026-07-24 11:35 AM  
**Analisador:** Copilot Code Analysis  
**Status:** Requer ação imediata
