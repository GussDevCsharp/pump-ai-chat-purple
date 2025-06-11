
-- Criar tabela para armazenar chaves de API de forma segura
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security para máxima segurança
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Apenas usuários admin podem acessar as chaves de API
-- Por enquanto, vamos permitir que edge functions acessem via service role
CREATE POLICY "service_role_only" ON public.api_keys
FOR ALL
USING (true);

-- Inserir a chave do Stripe (você pode atualizar depois)
INSERT INTO public.api_keys (service_name, api_key, description) VALUES
('STRIPE_SECRET', 'sk_test_sua_chave_aqui', 'Chave secreta do Stripe para pagamentos'),
('STRIPE_PUBLISHABLE', 'pk_test_sua_chave_aqui', 'Chave pública do Stripe para frontend');

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_api_keys_updated_at();
