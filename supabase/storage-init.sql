-- Este arquivo deve ser executado manualmente no Editor SQL do Supabase
-- para criar o bucket de armazenamento para documentos

-- Criar o bucket para documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'Documentos de identidade',
  false,
  5242880, -- 5MB
  '{image/png,image/jpeg,image/jpg,application/pdf}'
);

-- Política para permitir acesso de leitura aos documentos
CREATE POLICY "Usuários podem visualizar seus próprios documentos" ON storage.objects
  FOR SELECT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir upload de documentos
CREATE POLICY "Usuários podem fazer upload de seus documentos" ON storage.objects
  FOR INSERT
  WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir que admins visualizem todos os documentos
CREATE POLICY "Admins podem visualizar todos os documentos" ON storage.objects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );
