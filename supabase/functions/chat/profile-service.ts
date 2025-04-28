
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EnterpriseProfile {
  management_style?: string;
  motivation?: string;
  difficulties?: string;
  goals_review_frequency?: string;
}

interface CompanyProfile {
  company_name?: string;
  business_segment?: string;
  main_products?: string;
  target_audience?: string;
  sales_model?: string;
  years_in_operation?: string;
  channel_type?: string;
  management_tools?: string;
}

export async function getUserProfiles(supabase: any, userEmail: string): Promise<{
  entrepreneur: EnterpriseProfile | null;
  company: CompanyProfile | null;
}> {
  try {
    // Primeiro, precisamos obter o ID do usuário a partir do email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();

    if (userError || !userData) {
      console.log("Erro ao buscar usuário por email:", userError);
      return { entrepreneur: null, company: null };
    }

    const userId = userData.id;

    // Buscar perfil do empreendedor
    const { data: entrepreneurProfile, error: entrepreneurError } = await supabase
      .from('entrepreneur_profiles')
      .select('management_style, motivation, difficulties, goals_review_frequency')
      .eq('user_id', userId)
      .maybeSingle();

    if (entrepreneurError) {
      console.log("Erro ao buscar perfil do empreendedor:", entrepreneurError);
    }

    // Buscar perfil da empresa
    const { data: companyProfile, error: companyError } = await supabase
      .from('company_profiles')
      .select('company_name, business_segment, main_products, target_audience, sales_model, years_in_operation, channel_type, management_tools')
      .eq('user_id', userId)
      .maybeSingle();

    if (companyError) {
      console.log("Erro ao buscar perfil da empresa:", companyError);
    }

    return {
      entrepreneur: entrepreneurProfile || null,
      company: companyProfile || null
    };
  } catch (error) {
    console.error("Erro ao buscar perfis:", error);
    return { entrepreneur: null, company: null };
  }
}

export function createFurtivePromptFragments(entrepreneurProfile: EnterpriseProfile | null, companyProfile: CompanyProfile | null): {
  fragment1: string;
  fragment2: string;
} {
  // Fragmento 1 - Restrição de Tema Empresarial (fixo para todos os usuários)
  const fragment1 = "Você é uma inteligência artificial especializada exclusivamente em temas empresariais. Suas respostas devem ser focadas em negócios, gestão, empreendedorismo, marketing, vendas, financeiro, jurídico, operações e temas corporativos. Ignore ou recuse responder qualquer solicitação que não esteja relacionada ao ambiente empresarial.";

  // Fragmento 2 - Perfil do Empresário e da Empresa (dinâmico, preenchido com dados reais)
  let fragment2 = "Considere o seguinte perfil para personalizar suas respostas: ";
  
  // Adicionar informações do empresário se disponíveis
  if (entrepreneurProfile) {
    fragment2 += "Perfil do Empresário: ";
    if (companyProfile?.business_segment) fragment2 += `atua no segmento de ${companyProfile.business_segment}, `;
    if (entrepreneurProfile.management_style) fragment2 += `com estilo de gestão ${entrepreneurProfile.management_style}, `;
    if (entrepreneurProfile.motivation) fragment2 += `motivado por ${entrepreneurProfile.motivation}. `;
    if (entrepreneurProfile.difficulties) fragment2 += `Suas principais dificuldades são ${entrepreneurProfile.difficulties} `;
    if (entrepreneurProfile.goals_review_frequency) fragment2 += `e ele revisa seus objetivos com frequência ${entrepreneurProfile.goals_review_frequency}. `;
  }
  
  // Adicionar informações da empresa se disponíveis
  if (companyProfile) {
    fragment2 += "Perfil da Empresa: ";
    if (companyProfile.company_name) fragment2 += `Nome ${companyProfile.company_name}, `;
    if (companyProfile.business_segment) fragment2 += `segmento ${companyProfile.business_segment}, `;
    if (companyProfile.main_products) fragment2 += `produtos ou serviços principais ${companyProfile.main_products}, `;
    if (companyProfile.target_audience) fragment2 += `público-alvo ${companyProfile.target_audience}, `;
    if (companyProfile.sales_model) fragment2 += `modelo de vendas ${companyProfile.sales_model}, `;
    if (companyProfile.years_in_operation) fragment2 += `tempo de operação ${companyProfile.years_in_operation}, `;
    if (companyProfile.channel_type) fragment2 += `canais de venda ${companyProfile.channel_type}, `;
    if (companyProfile.management_tools) fragment2 += `ferramentas de gestão ${companyProfile.management_tools}. `;
  }
  
  fragment2 += "Utilize essas informações para criar respostas extremamente alinhadas ao contexto do cliente, garantindo máxima relevância, aplicabilidade prática e coerência empresarial nas suas respostas.";

  return { fragment1, fragment2 };
}
