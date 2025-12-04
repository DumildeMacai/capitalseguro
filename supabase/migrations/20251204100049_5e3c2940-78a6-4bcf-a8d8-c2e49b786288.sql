-- Criar tabela saques
CREATE TABLE IF NOT EXISTS public.saques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  valor NUMERIC NOT NULL,
  metodo TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  comprovante_url TEXT,
  aprovado_por UUID,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on saques
ALTER TABLE public.saques ENABLE ROW LEVEL SECURITY;

-- RLS policies for saques
CREATE POLICY "Users can create withdrawals" ON public.saques
FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can view own withdrawals" ON public.saques
FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can view all withdrawals" ON public.saques
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can update withdrawals" ON public.saques
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Add tipo_juros and tipo_renda columns to investimentos
ALTER TABLE public.investimentos 
ADD COLUMN IF NOT EXISTS tipo_juros TEXT DEFAULT 'simples',
ADD COLUMN IF NOT EXISTS tipo_renda TEXT DEFAULT 'fixa';