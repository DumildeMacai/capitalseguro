-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  email TEXT,
  telefone TEXT,
  data_nascimento DATE,
  nif TEXT,
  endereco TEXT,
  cidade TEXT,
  pais TEXT DEFAULT 'Angola',
  documento_tipo TEXT,
  documento_numero TEXT,
  documento_url TEXT,
  avatar_url TEXT,
  bio TEXT,
  empresa_nome TEXT,
  ramo_negocio TEXT,
  saldo_disponivel DECIMAL(15,2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create investimentos table
CREATE TABLE IF NOT EXISTS public.investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT DEFAULT 'Outros',
  valor_minimo DECIMAL(15,2) DEFAULT 1000,
  retorno_estimado DECIMAL(5,2) DEFAULT 50,
  prazo_minimo INTEGER DEFAULT 12,
  imagem TEXT,
  ativo BOOLEAN DEFAULT true,
  colocacao TEXT DEFAULT 'oportunidades',
  remaining DECIMAL(15,2) DEFAULT 0,
  total_funding DECIMAL(15,2) DEFAULT 0,
  risco TEXT DEFAULT 'Médio',
  criado_por UUID REFERENCES auth.users(id),
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on investimentos
ALTER TABLE public.investimentos ENABLE ROW LEVEL SECURITY;

-- Public can view active investments
CREATE POLICY "Anyone can view active investments" ON public.investimentos FOR SELECT USING (ativo = true);
CREATE POLICY "Admins can manage investments" ON public.investimentos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create inscricoes_investimentos (user investments)
CREATE TABLE IF NOT EXISTS public.inscricoes_investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investimento_id UUID NOT NULL REFERENCES public.investimentos(id) ON DELETE CASCADE,
  valor_investido DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pendente',
  data_inscricao TIMESTAMPTZ DEFAULT now(),
  data_aprovacao TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.inscricoes_investimentos ENABLE ROW LEVEL SECURITY;

-- RLS for inscricoes
CREATE POLICY "Users can view own investments" ON public.inscricoes_investimentos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can create investments" ON public.inscricoes_investimentos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Admins can view all investments" ON public.inscricoes_investimentos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(15,2) NOT NULL,
  metodo TEXT NOT NULL,
  comprovante_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT now(),
  data_aprovacao TIMESTAMPTZ,
  aprovado_por UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- RLS for deposits
CREATE POLICY "Users can view own deposits" ON public.deposits FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can create deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Admins can view all deposits" ON public.deposits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update deposits" ON public.deposits FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Function to get user type
CREATE OR REPLACE FUNCTION public.get_user_type(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_is_admin BOOLEAN;
BEGIN
  SELECT is_admin INTO user_is_admin FROM profiles WHERE id = user_id;
  IF user_is_admin = true THEN
    RETURN 'admin';
  END IF;
  RETURN 'investor';
END;
$$;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, email, saldo_disponivel)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.raw_user_meta_data->>'full_name'),
    NEW.email,
    0
  );
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();