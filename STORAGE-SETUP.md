# Setup de Storage - Investimentos

## Configuração de Buckets no Supabase

O admin agora pode fazer upload de fotos ao criar/editar investimentos. Para isso, você precisa criar um bucket de storage chamado `investimentos`.

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Abra o Supabase Dashboard**
   - Vá para seu projeto
   - Clique em "Storage" no menu lateral

2. **Crie o bucket `investimentos`**
   - Clique em "Create a new bucket"
   - Nome: `investimentos`
   - Deixe "Public bucket" **marcado** ✓
   - Clique "Create bucket"

3. **Configure as políticas (Policies)**
   - Selecione o bucket `investimentos`
   - Vá para a aba "Policies"
   - Se houver políticas padrão, delete-as
   - Clique "New Policy" e configure as seguintes:

   **Policy 1: Public Read**
   - Target roles: `public`
   - Operation: `SELECT`
   - USING condition: `true`
   - Save

   **Policy 2: Admin Upload**
   - Target roles: `authenticated`
   - Operation: `INSERT`
   - WITH CHECK condition: `public.has_role(auth.uid(), 'admin')`
   - Save

   **Policy 3: Admin Delete**
   - Target roles: `authenticated`
   - Operation: `DELETE`
   - USING condition: `public.has_role(auth.uid(), 'admin')`
   - Save

### Opção 2: Via SQL Script

1. Abra o arquivo `/supabase/setup-storage.sql`
2. Vá para Supabase SQL Editor
3. Copie o conteúdo completo do arquivo
4. Cole no SQL Editor
5. Clique "RUN"

## Como Funciona

**Admin criando investimento com foto:**

1. Admin Dashboard → Investimentos → "Novo Investimento"
2. Preencha os dados do investimento
3. Na seção "Imagem":
   - Clique na área de upload ou arraste a imagem
   - A imagem será previsualizador
4. Clique "Criar" para salvar

**A foto será:**
- Armazenada em Supabase Storage no bucket `investimentos`
- A URL será salva no banco de dados na coluna `imagem` da tabela `investimentos`
- Exibida automaticamente nas páginas de investimentos para os investidores

## Estrutura do Upload

```
storage/
└── investimentos/
    ├── investimento-1732720434123-property.jpg
    ├── investimento-1732720534567-startup.png
    └── investimento-1732720634890-fund.jpg
```

Cada arquivo é nomeado com:
- `investimento-` (prefixo)
- Timestamp do upload
- Nome original do arquivo

## Notas

- ✓ Apenas admins podem fazer upload/deletar fotos
- ✓ Qualquer pessoa pode visualizar as fotos (public read)
- ✓ Suporta: JPG, PNG, GIF, WebP e outros formatos de imagem
- ✓ Tamanho máximo: depende da configuração do seu projeto Supabase (padrão: 50MB)
- ✓ Se não houver imagem, o campo fica vazio

## Troubleshooting

**Erro: "Permission denied"**
- Verifique se o bucket está público
- Verifique se o usuário é admin (tem role `admin`)
- Verifique as políticas RLS do bucket

**Imagem não aparece depois de upload**
- Verifique a URL no banco de dados (coluna `imagem` em `investimentos`)
- Verifique se o arquivo existe no Storage
- Limpe o cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)

**Upload muito lento**
- Comprima a imagem antes de fazer upload
- Máximo recomendado: 5MB por imagem
