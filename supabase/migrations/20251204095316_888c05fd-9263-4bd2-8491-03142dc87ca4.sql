-- Remover o usuário admin inválido que foi inserido diretamente
DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';