# 🔒 Configuração de Segurança - Sistema de Roles

## ⚠️ IMPORTANTE - Execute estas etapas!

### 1. Execute a Migração SQL

Execute o arquivo `supabase/fix-security-and-storage.sql` no **SQL Editor** do Supabase:

1. Acesse: https://supabase.com/dashboard/project/xmemmdmyzwimluvgiqal/sql/new
2. Cole todo o conteúdo do arquivo `fix-security-and-storage.sql`
3. Clique em **"Run"**

### 2. Promova seu Usuário a Admin

Após executar a migração, você precisa promover seu usuário para admin. Execute este comando no SQL Editor:

\`\`\`sql
-- Substitua 'SEU-USER-ID' pelo seu ID de usuário
SELECT public.set_user_as_admin('75f9ba92-f94f-452e-8fff-5e1096e571ec');
\`\`\`

Para encontrar seu User ID:
- Vá em **Authentication > Users** no Supabase
- Copie o UUID do seu usuário

### 3. Verifique suas Roles

Execute no SQL Editor para confirmar:

\`\`\`sql
SELECT * FROM public.user_roles WHERE user_id = auth.uid();
\`\`\`

## 🛡️ O que foi corrigido?

### ✅ Problema 1: Recursão Infinita no Storage (RESOLVIDO)
- **Antes**: Políticas de storage causavam loop infinito
- **Depois**: Políticas otimizadas sem referências recursivas
- **Resultado**: Upload de documentos funcionando ✓

### ✅ Problema 2: Sistema de Roles Inseguro (RESOLVIDO)
- **Antes**: Roles armazenadas na tabela `profiles` (vulnerável)
- **Depois**: Tabela `user_roles` separada com `SECURITY DEFINER`
- **Resultado**: Proteção contra escalação de privilégios ✓

### ✅ Problema 3: Verificações de Admin no Cliente (RESOLVIDO)
- **Antes**: Emails de admin hardcoded no código
- **Depois**: Verificação server-side via banco de dados
- **Resultado**: Segurança real, não apenas cosmética ✓

## 📋 Nova Estrutura de Banco de Dados

### Tabela `user_roles`
\`\`\`sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- role: app_role ENUM ('admin', 'parceiro', 'investidor')
- created_at: TIMESTAMP
\`\`\`

### Funções Disponíveis

#### `public.has_role(user_id, role)`
Verifica se usuário tem uma role específica (usada nas políticas RLS)

#### `public.get_user_type(user_id)`
Retorna a role primária do usuário (para compatibilidade)

#### `public.set_user_as_admin(user_id)`
Promove um usuário para admin (execute via SQL apenas)

## 🔐 Como Gerenciar Roles

### Promover Usuário a Admin
\`\`\`sql
SELECT public.set_user_as_admin('user-id-aqui');
\`\`\`

### Adicionar Role de Parceiro
\`\`\`sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-id-aqui', 'parceiro');
\`\`\`

### Remover Role
\`\`\`sql
DELETE FROM public.user_roles 
WHERE user_id = 'user-id-aqui' AND role = 'admin';
\`\`\`

### Listar Todos os Admins
\`\`\`sql
SELECT u.email, ur.role, ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
\`\`\`

## 🚨 Segurança - O que NÃO fazer

❌ **NUNCA** verifique admin status usando:
- `localStorage` ou `sessionStorage`
- Emails hardcoded no código
- Verificações apenas no frontend

✅ **SEMPRE** use:
- Políticas RLS no banco de dados
- Funções `SECURITY DEFINER`
- Tabela `user_roles` separada

## 📝 Notas Importantes

1. **Usuários novos**: Por padrão recebem role `investidor`
2. **Multiple roles**: Um usuário pode ter múltiplas roles
3. **Role primária**: `get_user_type()` retorna na ordem: admin > parceiro > investidor
4. **Mudanças de role**: Exigem logout/login para refletir no frontend

## ✅ Checklist de Configuração

- [ ] Executei o script `fix-security-and-storage.sql`
- [ ] Promovi meu usuário para admin
- [ ] Testei login/registro
- [ ] Testei upload de documentos
- [ ] Configurei Site URL e Redirect URLs no Supabase

## 🆘 Problemas Comuns

### "infinite recursion detected"
**Solução**: Execute a migração `fix-security-and-storage.sql`

### "Acesso negado ao dashboard admin"
**Solução**: Execute `set_user_as_admin()` com seu user ID

### "Upload de documentos falha"
**Solução**: Verifique se o bucket 'documentos' existe e tem as políticas corretas

---

📚 **Para mais informações**: Consulte a [documentação oficial](https://docs.lovable.dev/features/security)
