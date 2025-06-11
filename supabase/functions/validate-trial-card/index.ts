
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-TRIAL-CARD] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { email, cardNumber, cardExpiry, cardCvc } = await req.json();
    logStep("Request data received", { email, cardNumber: "****", cardExpiry, cardCvc: "***" });

    // Buscar a chave do Stripe no banco
    const { data: keyData, error: keyError } = await supabaseClient
      .from("api_keys")
      .select("api_key")
      .eq("service_name", "STRIPE_SECRET")
      .eq("is_active", true)
      .single();

    if (keyError || !keyData) {
      logStep("Stripe key not found", { error: keyError });
      throw new Error("Chave do Stripe não configurada");
    }

    const stripe = new Stripe(keyData.api_key, { apiVersion: "2023-10-16" });
    logStep("Stripe initialized");

    // Verificar se já existe um customer com esse email
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Criar novo customer
      const customer = await stripe.customers.create({
        email,
        description: `Trial customer for ${email}`,
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Separar mês e ano da data de validade
    const [month, year] = cardExpiry.split('/');
    const expYear = parseInt(`20${year}`);
    const expMonth = parseInt(month);

    // Criar payment method para validar o cartão
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cardCvc,
      },
    });

    logStep("Payment method created", { paymentMethodId: paymentMethod.id });

    // Anexar o payment method ao customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    logStep("Payment method attached to customer");

    // Definir como método de pagamento padrão
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    logStep("Default payment method set");

    return new Response(JSON.stringify({ 
      success: true, 
      customer_id: customerId,
      payment_method_id: paymentMethod.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in validate-trial-card", { message: errorMessage });
    
    // Traduzir alguns erros comuns do Stripe
    let translatedError = errorMessage;
    if (errorMessage.includes("card_number_invalid")) {
      translatedError = "Número do cartão inválido";
    } else if (errorMessage.includes("card_expiry_invalid")) {
      translatedError = "Data de validade inválida";
    } else if (errorMessage.includes("card_cvc_invalid")) {
      translatedError = "CVC inválido";
    } else if (errorMessage.includes("card_declined")) {
      translatedError = "Cartão recusado";
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: translatedError 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Retornamos 200 para que o frontend processe o erro
    });
  }
});
