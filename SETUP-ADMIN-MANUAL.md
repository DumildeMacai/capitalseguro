# Como Configurar o Usuário Admin

## Método 1: Via SQL (Mais Rápido)

Se o usuário **admin@admin.com** já existe no Supabase, execute isto:

1. Vá para seu projeto no Supabase: https://app.supabase.com
2. Clique em **SQL Editor**
3. Clique em **New Query**
4. Cole este código:

\`\`\`sql
-- Define admin@admin.com como administrador
SELECT public.set_user_as_admin('admin@admin.com');
\`\`\`

5. Clique em **Run**

## Método 2: Via Supabase Dashboard (Se o usuário não existe)

1. Vá para **Authentication** → **Users**
2. Clique em **Add user**
3. Preencha:
   - Email: `admin@admin.com`
   - Password: `1dumilde1@A`
4. Clique em **Create user**
5. Após criado, execute o SQL do Método 1

## Método 3: Via Script Node.js (Automático)

Se tiver as variáveis de ambiente configuradas:

\`\`\`bash
npm run setup:admin
\`\`\`

## Verificação

Após completar um dos métodos acima:

1. Vá para o site
2. Clique em "Entrar"
3. Login com:
   - Email: `admin@admin.com`
   - Senha: `1dumilde1@A`
4. Você deve ser redirecionado para `/admin` automaticamente

## Variáveis de Ambiente Necessárias

Para o Método 3 (setup:admin), você precisa ter no seu `.env`:

\`\`\`
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Troubleshooting

Se não for redirecionado para `/admin`:

1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Procure por erros relacionados a `get_user_type`
4. Verifique se a RPC `set_user_as_admin` foi executada com sucesso
