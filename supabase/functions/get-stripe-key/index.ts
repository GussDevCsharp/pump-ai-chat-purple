
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-STRIPE-KEY] ${step}${detailsStr}`);
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

    const { keyType } = await req.json();
    logStep("Key type requested", { keyType });

    // Buscar a chave do Stripe no banco
    const { data: keyData, error } = await supabaseClient
      .from("api_keys")
      .select("api_key")
      .eq("service_name", keyType === "secret" ? "STRIPE_SECRET" : "STRIPE_PUBLISHABLE")
      .eq("is_active", true)
      .single();

    if (error) {
      logStep("Error fetching key", { error: error.message });
      throw new Error("Chave do Stripe não encontrada");
    }

    logStep("Key retrieved successfully");

    return new Response(JSON.stringify({ key: keyData.api_key }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in get-stripe-key", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
