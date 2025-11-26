# Setup do Usuário Admin

## Passo 1: Criar o usuário admin no Supabase

1. Vá ao dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto "capitalseguro"
3. Vá para **Authentication** → **Users**
4. Clique em **Add user**
5. Preencha com:
   - Email: `admin@admin.com`
   - Password: `1dumilde1@A`
6. Clique em **Create user**

## Passo 2: Definir como Admin (SQL)

1. Vá para **SQL Editor** no Supabase
2. Crie uma nova query
3. Cole o seguinte código:

\`\`\`sql
-- Executar esta query para tornar admin@admin.com um administrador
SELECT public.set_user_as_admin('admin@admin.com');
\`\`\`

4. Clique em **Run**

## Pronto!

Agora você pode fazer login com:
- Email: `admin@admin.com`
- Senha: `1dumilde1@A`

E será redirecionado automaticamente para `/admin`

## Alternativa: Via Script Node.js

Se preferir criar via código, execute:

\`\`\`bash
npm run setup:admin
\`\`\`

Este script criará o usuário e definirá como admin automaticamente.
