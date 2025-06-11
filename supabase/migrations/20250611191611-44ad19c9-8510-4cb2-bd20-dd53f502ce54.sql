
-- Criar tabela subscribers para tracking de assinaturas
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Atualizar tabela pricing com os novos planos pagos (usando UUIDs válidos)
INSERT INTO public.pricing (id, name, description, chatpump) VALUES
(gen_random_uuid(), 'Plano Mensal', 'Acesso completo à plataforma - R$ 69/mês', true),
(gen_random_uuid(), 'Plano Trimestral', 'Acesso completo à plataforma - R$ 59/mês', true),
(gen_random_uuid(), 'Plano Anual', 'Acesso completo à plataforma - R$ 49/mês', true);

-- Atualizar benefícios para os novos planos
INSERT INTO public.benefits (id, description) VALUES
(gen_random_uuid(), 'Chat especializado premium'),
(gen_random_uuid(), 'Conversas ilimitadas'),
(gen_random_uuid(), 'Análises avançadas'),
(gen_random_uuid(), 'Suporte prioritário'),
(gen_random_uuid(), 'Integrações personalizadas');

-- Como não podemos referenciar os UUIDs gerados automaticamente, vamos mapear os benefícios
-- usando uma consulta que encontra os IDs baseados nos nomes
WITH plan_ids AS (
  SELECT id, name FROM pricing WHERE chatpump = true
),
benefit_ids AS (
  SELECT id, description FROM benefits WHERE description IN (
    'Chat especializado premium', 
    'Conversas ilimitadas', 
    'Análises avançadas', 
    'Suporte prioritário', 
    'Integrações personalizadas'
  )
)
INSERT INTO public.plan_benefit_mappings (plan_id, benefit_id)
SELECT p.id, b.id FROM plan_ids p CROSS JOIN benefit_ids b
WHERE 
  (p.name = 'Plano Mensal' AND b.description IN ('Chat especializado premium', 'Conversas ilimitadas', 'Análises avançadas', 'Suporte prioritário'))
  OR 
  (p.name = 'Plano Trimestral' AND b.description IN ('Chat especializado premium', 'Conversas ilimitadas', 'Análises avançadas', 'Suporte prioritário', 'Integrações personalizadas'))
  OR 
  (p.name = 'Plano Anual' AND b.description IN ('Chat especializado premium', 'Conversas ilimitadas', 'Análises avançadas', 'Suporte prioritário', 'Integrações personalizadas'));
