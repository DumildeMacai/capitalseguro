-- Criar usuário admin para testes
-- Nota: Este SQL cria um usuário diretamente na tabela auth.users

-- Inserir usuário na tabela auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@admin.com',
  -- Senha: 1dumilde1@A (hash bcrypt)
  '$2a$10$5vXEqNrXuCVrCx2Rh6uA8.zFVw4LJ3dJHRXKE2Y8BXRz9sVRXqxLu',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nome_completo":"Admin Sistema"}',
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Criar perfil para o admin
INSERT INTO public.profiles (
  id,
  email,
  nome_completo,
  is_admin,
  saldo_disponivel,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@admin.com',
  'Admin Sistema',
  true,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  email = 'admin@admin.com';