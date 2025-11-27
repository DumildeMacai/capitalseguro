# Sistema de Notificações - Implementação Completa

## Resumo
Foi implementado um **sistema completo de notificações** para que administradores possam enviar mensagens aos investidores e parceiros, e eles possam recebê-las em tempo real no dashboard.

## Componentes Implementados

### 1. Banco de Dados
**Arquivo**: `supabase/setup-admin-tables.sql`

Tabela `notifications` com os seguintes campos:
- `id`: UUID (chave primária)
- `usuario_id`: UUID (referência para auth.users)
- `tipo`: TEXT (ex: "admin", "sistema")
- `titulo`: TEXT (título da notificação)
- `mensagem`: TEXT (conteúdo da mensagem)
- `lido`: BOOLEAN (default: false)
- `relacionada_a`: TEXT (identificação de tipo de notificação)
- `investimento_id`: UUID (opcional, referência a investimentos)
- `data_criacao`: TIMESTAMP WITH TIME ZONE (auto)
- `data_leitura`: TIMESTAMP WITH TIME ZONE (quando marcada como lida)

**RLS Policies**:
- Usuários veem apenas suas próprias notificações
- Admin pode criar notificações para qualquer usuário
- Usuários podem marcar suas notificações como lidas

**Indexes**:
- `usuario_id` (para buscar notificações de um usuário)
- `lido` (para filtrar lidas/não lidas)
- `data_criacao` (para ordenação)

---

### 2. Componente Frontend: `NotificationsSection.tsx`
**Arquivo**: `src/components/NotificationsSection.tsx`

Componente reutilizável que exibe:
- ✅ Lista de notificações em ordem cronológica reversa
- ✅ Status "Novo" para notificações não lidas
- ✅ Indicador de quantidade de notificações não lidas
- ✅ Ícone para marcar como lida
- ✅ Botão para deletar notificação
- ✅ Real-time updates via Supabase Realtime
- ✅ Data e hora da notificação

**Funcionalidades**:
```
fetchNotifications()     - Busca notificações do banco
handleMarkAsRead()       - Marca notificação como lida
handleDeleteNotification() - Deleta notificação
```

**Real-time Subscription**:
- Inscrição automática em mudanças da tabela `notifications`
- Atualização automática da UI quando nova notificação chega
- Cleanup de subscription ao desmontar

---

### 3. AdminInvestors.tsx
**Arquivo**: `src/components/AdminInvestors.tsx`

Método atualizado:
```typescript
handleSendNotification = async () => {
  // Salva notificação no banco de dados
  await supabase.from("notifications").insert({
    usuario_id: selectedInvestor.id,
    tipo: "admin",
    titulo: "Mensagem do Administrador",
    mensagem: notificationMessage,
    lido: false,
    relacionada_a: "geral",
  });
}
```

---

### 4. AdminPartners.tsx
**Arquivo**: `src/components/AdminPartners.tsx`

Mesmo padrão que AdminInvestors:
```typescript
handleSendNotification = async () => {
  // Salva notificação no banco de dados
  await supabase.from("notifications").insert({
    usuario_id: selectedPartner.id,
    tipo: "admin",
    titulo: "Mensagem do Administrador",
    mensagem: notificationMessage,
    lido: false,
    relacionada_a: "geral",
  });
}
```

---

### 5. InvestorDashboard.tsx
**Arquivo**: `src/pages/InvestorDashboard.tsx`

Adições:
1. Import do `NotificationsSection` component
2. Novo estado `userId` para rastrear usuário autenticado
3. Nova menu item na sidebar: "Notificações"
4. Novo TabsTrigger: "Notificações"
5. Novo TabsContent: Renderiza `<NotificationsSection userId={userId} />`

---

## Fluxo de Funcionamento

### Como Investidor Recebe Notificação:

```
1. Admin vai para AdminInvestors
   ↓
2. Clica em "Notificar" no menu de ações do investidor
   ↓
3. Escreve mensagem e clica "Enviar"
   ↓
4. NotificationsSection salva na tabela `notifications`
   ↓
5. Real-time subscription do investidor detecta nova notificação
   ↓
6. Notificação aparece automaticamente na aba "Notificações"
   ↓
7. Investidor vê notificação com "Novo" badge
   ↓
8. Investidor pode clicar ✓ para marcar como lida ou 🗑️ para deletar
```

---

## Como Usar

### Para o Admin (Enviar Notificação)

1. Ir para **Admin Dashboard**
2. Clicar em **Investidores** ou **Parceiros**
3. No menu de ações (⋮), clicar **Notificar**
4. Escrever mensagem
5. Clicar **Enviar**

### Para o Investidor (Receber Notificação)

1. Ir para **InvestorDashboard**
2. Clicar em **Notificações** no menu lateral
3. Ver lista de notificações recebidas
4. Clicar ✓ para marcar como lida
5. Clicar 🗑️ para deletar

---

## Próximos Passos

**⚠️ IMPORTANTE**: Você precisa executar a migração SQL para criar a tabela:

1. Abrir **Supabase SQL Editor**
2. Copiar todo o conteúdo de `supabase/setup-admin-tables.sql`
3. Colar no SQL Editor
4. Clicar **RUN**
5. Verificar se executou com sucesso

**Depois**:
- Reload da aplicação no navegador
- Testar: Admin enviando notificação → Investidor recebendo em tempo real

---

## Tecnologias Utilizadas

- **Supabase**: Banco de dados PostgreSQL com RLS
- **Realtime**: Supabase Realtime para atualizações em tempo real
- **React Hooks**: useState, useEffect para gerenciar estado
- **shadcn/ui**: Componentes UI (Card, Badge, Button)
- **Tailwind CSS**: Estilização

---

## Commits

```
58eb737 feat: implementar sistema completo de notificações para investidores
71e26bb fix: remover sintaxe IF NOT EXISTS de CREATE POLICY no setup-admin-tables.sql
```

---

## Estrutura da Notificação

```typescript
interface Notification {
  id: string;                    // UUID único
  titulo: string;                // "Mensagem do Administrador"
  mensagem: string;              // Conteúdo da mensagem
  tipo: string;                  // "admin", "sistema", etc
  lido: boolean;                 // true/false
  data_criacao: string;          // ISO timestamp
  relacionada_a?: string;        // "geral", "investimento", etc
  investimento_id?: UUID;        // ID do investimento (opcional)
}
```

---

## Segurança

✅ RLS (Row Level Security) implementado:
- Cada usuário vê apenas suas notificações
- Admin pode criar, usuários podem atualizar as suas
- Policies protegem contra acesso não autorizado

✅ Validação:
- Campo `mensagem` obrigatório
- Mensagem vazia → erro com aviso ao admin

---
