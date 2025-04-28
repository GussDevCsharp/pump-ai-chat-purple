
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getUserProfiles(supabase: any, userEmail: string | null) {
  if (!userEmail) {
    console.log("No user email provided, skipping profile fetch");
    return { entrepreneur: null, company: null };
  }

  try {
    // Get entrepreneur profile
    const { data: entrepreneurData, error: entrepreneurError } = await supabase
      .from('entrepreneur_profiles')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();

    if (entrepreneurError) {
      console.error("Error fetching entrepreneur profile:", entrepreneurError);
    }

    // Get company profile
    const { data: companyData, error: companyError } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('entrepreneur_email', userEmail)
      .maybeSingle();

    if (companyError) {
      console.error("Error fetching company profile:", companyError);
    }

    return {
      entrepreneur: entrepreneurData || null,
      company: companyData || null
    };
  } catch (error) {
    console.error("Error in getUserProfiles:", error);
    return { entrepreneur: null, company: null };
  }
}

export function createFurtiveFragments(entrepreneurProfile: any, companyProfile: any) {
  // If no profiles available, return null
  if (!entrepreneurProfile && !companyProfile) {
    console.log("No profiles available for furtive fragments");
    return null;
  }

  // Create default values for missing profile data
  const entrepreneur = entrepreneurProfile || {};
  const company = companyProfile || {};
  
  // Fragment 1: Business restriction (fixed for all users)
  const fragment1 = "Você é uma inteligência artificial especializada exclusivamente em temas empresariais. Suas respostas devem ser focadas em negócios, gestão, empreendedorismo, marketing, vendas, financeiro, jurídico, operações e temas corporativos. Ignore ou recuse responder qualquer solicitação que não esteja relacionada ao ambiente empresarial.";
  
  // Fragment 2: Dynamic profile information
  const fragment2 = `Considere o seguinte perfil para personalizar suas respostas: 
Perfil do Empresário: atua no segmento de ${entrepreneur.business_segment || 'não informado'}, 
com estilo de gestão ${entrepreneur.management_style || 'não informado'}, 
motivado por ${entrepreneur.motivation || 'não informado'}. 
Suas principais dificuldades são ${entrepreneur.difficulties || 'não informadas'} e 
ele revisa seus objetivos com frequência ${entrepreneur.goals_review_frequency || 'não informada'}. 

Perfil da Empresa: 
Nome ${company.company_name || 'não informado'}, 
segmento ${company.business_segment || 'não informado'}, 
produtos ou serviços principais ${company.main_products || 'não informados'}, 
público-alvo ${company.target_audience || 'não informado'}, 
modelo de vendas ${company.sales_model || 'não informado'}, 
tempo de operação ${company.years_in_operation || 'não informado'}, 
canais de venda ${company.channel_type || 'não informados'}, 
ferramentas de gestão ${company.management_tools || 'não informadas'}. 

Utilize essas informações para criar respostas extremamente alinhadas ao contexto do cliente, garantindo máxima relevância, aplicabilidade prática e coerência empresarial nas suas respostas.`;
  
  return {
    fragment1,
    fragment2
  };
}
