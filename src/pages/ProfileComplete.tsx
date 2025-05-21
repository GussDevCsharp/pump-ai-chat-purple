
import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Header } from "@/components/common/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import NeuralBackground from "@/components/effects/NeuralBackground"
import { useTheme } from "@/hooks/useTheme"
import { Wand } from "lucide-react"
import { useAIGeneration } from "@/hooks/useAIGeneration"

export default function ProfileComplete() {
  const { isDark } = useTheme();
  const { generateWithAI, isGenerating } = useAIGeneration();
  
  // Entrepreneur profile state
  const [mainGoal, setMainGoal] = useState("")
  const [entrepreneurshipReason, setEntrepreneurshipReason] = useState("")
  const [managementStyle, setManagementStyle] = useState("")
  const [motivation, setMotivation] = useState("")
  const [difficulties, setDifficulties] = useState("")
  const [goalsReviewFrequency, setGoalsReviewFrequency] = useState("")
  const [teamStatus, setTeamStatus] = useState("")
  const [planningTimeWeekly, setPlanningTimeWeekly] = useState("")
  const [technologyInvestment, setTechnologyInvestment] = useState(false)
  const [leadershipStyle, setLeadershipStyle] = useState("")
  
  // Company profile state
  const [companyName, setCompanyName] = useState("")
  const [yearsInOperation, setYearsInOperation] = useState("")
  const [mainProducts, setMainProducts] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [channelType, setChannelType] = useState("")
  const [salesModel, setSalesModel] = useState("")
  const [averageRevenue, setAverageRevenue] = useState("")
  const [employeesCount, setEmployeesCount] = useState("")
  const [managementTools, setManagementTools] = useState("")
  const [documentedProcesses, setDocumentedProcesses] = useState(false)
  const [biggestChallenge, setBiggestChallenge] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Handle AI generation for text fields
  const handleGenerateField = async (fieldId: string) => {
    // Collect all form data to provide context
    const contextData = {
      companyName,
      yearsInOperation,
      mainProducts,
      targetAudience, 
      channelType,
      salesModel,
      averageRevenue,
      employeesCount,
      managementTools,
      documentedProcesses,
      mainGoal,
      entrepreneurshipReason,
      managementStyle,
      motivation,
      difficulties,
      goalsReviewFrequency,
      teamStatus,
      planningTimeWeekly,
      technologyInvestment,
      leadershipStyle
    };
    
    const generatedText = await generateWithAI({
      field: fieldId,
      contextData,
    });
    
    if (!generatedText) return;
    
    // Update the corresponding field
    switch (fieldId) {
      case "mainGoal":
        setMainGoal(generatedText);
        break;
      case "entrepreneurshipReason":
        setEntrepreneurshipReason(generatedText);
        break;
      case "motivation":
        setMotivation(generatedText);
        break;
      case "difficulties":
        setDifficulties(generatedText);
        break;
      case "mainProducts":
        setMainProducts(generatedText);
        break;
      case "targetAudience":
        setTargetAudience(generatedText);
        break;
      case "biggestChallenge":
        setBiggestChallenge(generatedText);
        break;
    }
    
    toast.success(`Campo gerado com sucesso!`);
  };
  
  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) return
        
        const userId = session.session.user.id
        
        // Fetch company profile
        const { data: companyProfile } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
        
        if (companyProfile) {
          setCompanyName(companyProfile.company_name || "")
          setYearsInOperation(companyProfile.years_in_operation || "")
          setMainProducts(companyProfile.main_products || "")
          setTargetAudience(companyProfile.target_audience || "")
          setChannelType(companyProfile.channel_type || "")
          setSalesModel(companyProfile.sales_model || "")
          setAverageRevenue(companyProfile.average_revenue?.toString() || "")
          setEmployeesCount(companyProfile.employees_count?.toString() || "")
          setManagementTools(companyProfile.management_tools || "")
          setDocumentedProcesses(companyProfile.documented_processes || false)
          setBiggestChallenge(companyProfile.biggest_challenge || "")
        }
        
        // Fetch entrepreneur profile
        const { data: entrepreneurProfile } = await supabase
          .from('entrepreneur_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
        
        if (entrepreneurProfile) {
          setMainGoal(entrepreneurProfile.main_goal || "")
          setEntrepreneurshipReason(entrepreneurProfile.entrepreneurship_reason || "")
          setManagementStyle(entrepreneurProfile.management_style || "")
          setMotivation(entrepreneurProfile.motivation || "")
          setDifficulties(entrepreneurProfile.difficulties || "")
          setGoalsReviewFrequency(entrepreneurProfile.goals_review_frequency || "")
          setTeamStatus(entrepreneurProfile.team_status || "")
          setPlanningTimeWeekly(entrepreneurProfile.planning_time_weekly || "")
          setTechnologyInvestment(entrepreneurProfile.technology_investment || false)
          setLeadershipStyle(entrepreneurProfile.leadership_style || "")
        }
      } catch (error) {
        console.error('Error fetching profiles:', error)
      }
    }
    
    fetchProfiles()
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        toast.error("Você precisa estar logado para completar seu perfil")
        navigate('/login')
        return
      }
      
      const userId = session.session.user.id
      
      // Update or create company profile
      const { error: companyError } = await supabase
        .from('company_profiles')
        .upsert({
          user_id: userId,
          company_name: companyName,
          years_in_operation: yearsInOperation,
          main_products: mainProducts,
          target_audience: targetAudience,
          channel_type: channelType,
          sales_model: salesModel,
          average_revenue: averageRevenue ? parseFloat(averageRevenue) : null,
          employees_count: employeesCount ? parseInt(employeesCount) : null,
          management_tools: managementTools,
          documented_processes: documentedProcesses,
          biggest_challenge: biggestChallenge,
          profile_completed: true,
        })
      
      if (companyError) throw companyError
      
      // Update or create entrepreneur profile
      const { error: entrepreneurError } = await supabase
        .from('entrepreneur_profiles')
        .upsert({
          id: userId,
          user_id: userId,
          main_goal: mainGoal,
          entrepreneurship_reason: entrepreneurshipReason,
          management_style: managementStyle,
          motivation: motivation,
          difficulties: difficulties,
          goals_review_frequency: goalsReviewFrequency,
          team_status: teamStatus,
          planning_time_weekly: planningTimeWeekly,
          technology_investment: technologyInvestment,
          leadership_style: leadershipStyle,
        })
      
      if (entrepreneurError) throw entrepreneurError
      
      toast.success("Perfil atualizado com sucesso!")
      navigate('/themes')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(`Erro ao salvar perfil: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const nextStep = () => {
    if (activeStep < 1) setActiveStep(activeStep + 1)
  }
  
  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1)
  }

  // Function to render an AI button for text fields
  const renderAIButton = (fieldId: string) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => handleGenerateField(fieldId)}
      className={`px-2 py-1 h-8 text-xs flex items-center ${isDark ? 'bg-[#333333] text-white' : ''}`}
      disabled={isGenerating[fieldId]}
    >
      {isGenerating[fieldId] ? (
        <span className="flex items-center">
          <span className="animate-spin mr-1">⟳</span> Gerando...
        </span>
      ) : (
        <>
          <Wand className="w-3 h-3 mr-1" />
          Gerar com IA
        </>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-offwhite dark:bg-[#1A1F2C]">
      <NeuralBackground />
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white/90 dark:bg-[#222222]/90 backdrop-blur-sm rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-pump-purple dark:text-white mb-6">Complete seu perfil</h1>
          
          <div className="flex justify-between mb-8">
            <Button 
              variant={activeStep === 0 ? "default" : "outline"}
              className={activeStep === 0 
                ? "bg-pump-purple text-white dark:hover:bg-pump-purple/90" 
                : `${isDark ? "text-white" : "text-pump-gray border-gray-300"}`}
              onClick={() => setActiveStep(0)}
            >
              Perfil do Empresário
            </Button>
            
            <Button 
              variant={activeStep === 1 ? "default" : "outline"}
              className={activeStep === 1 
                ? "bg-pump-purple text-white dark:hover:bg-pump-purple/90" 
                : `${isDark ? "text-white" : "text-pump-gray border-gray-300"}`}
              onClick={() => setActiveStep(1)}
            >
              Perfil da Empresa
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeStep === 0 ? (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold text-pump-purple dark:text-white">🧠 Perfil do Empresário</h2>
                <Separator className="mb-4 dark:bg-gray-700" />
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Qual é o seu maior objetivo como empreendedor nos próximos 12 meses?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={mainGoal} 
                      onChange={(e) => setMainGoal(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("mainGoal")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Em poucas palavras, por que você decidiu empreender?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={entrepreneurshipReason} 
                      onChange={(e) => setEntrepreneurshipReason(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("entrepreneurshipReason")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Você se considera mais operacional, estratégico ou comercial no seu negócio?
                  </label>
                  <Select value={managementStyle} onValueChange={setManagementStyle}>
                    <SelectTrigger className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="estratégico">Estratégico</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="misto">Mistura de estilos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    O que mais te motiva no dia a dia da empresa?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={motivation} 
                      onChange={(e) => setMotivation(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("motivation")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Quais são suas maiores dificuldades como gestor hoje?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={difficulties} 
                      onChange={(e) => setDifficulties(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("difficulties")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Com que frequência você revisa ou ajusta suas metas?
                  </label>
                  <Select value={goalsReviewFrequency} onValueChange={setGoalsReviewFrequency}>
                    <SelectTrigger className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diariamente">Diariamente</SelectItem>
                      <SelectItem value="semanalmente">Semanalmente</SelectItem>
                      <SelectItem value="mensalmente">Mensalmente</SelectItem>
                      <SelectItem value="trimestralmente">Trimestralmente</SelectItem>
                      <SelectItem value="anualmente">Anualmente</SelectItem>
                      <SelectItem value="raramente">Raramente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Você trabalha com uma equipe ou sozinho atualmente?
                  </label>
                  <Select value={teamStatus} onValueChange={setTeamStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sozinho">Sozinho</SelectItem>
                      <SelectItem value="equipe pequena">Equipe pequena (1-5)</SelectItem>
                      <SelectItem value="equipe média">Equipe média (6-20)</SelectItem>
                      <SelectItem value="equipe grande">Equipe grande (20+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Quanto tempo por semana você dedica ao planejamento do seu negócio?
                  </label>
                  <Select value={planningTimeWeekly} onValueChange={setPlanningTimeWeekly}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menos de 1 hora">Menos de 1 hora</SelectItem>
                      <SelectItem value="1-3 horas">1-3 horas</SelectItem>
                      <SelectItem value="3-5 horas">3-5 horas</SelectItem>
                      <SelectItem value="mais de 5 horas">Mais de 5 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tech-investment" 
                    checked={technologyInvestment} 
                    onCheckedChange={(checked) => setTechnologyInvestment(checked as boolean)} 
                  />
                  <label htmlFor="tech-investment" className="text-sm font-medium">
                    Você já investiu ou pretende investir em tecnologia para melhorar a gestão?
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Em uma palavra, como você definiria seu estilo de liderança?
                  </label>
                  <Input 
                    value={leadershipStyle} 
                    onChange={(e) => setLeadershipStyle(e.target.value)} 
                    className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold text-pump-purple dark:text-white">🏢 Perfil da Empresa</h2>
                <Separator className="mb-4 dark:bg-gray-700" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                      Nome da empresa
                    </label>
                    <Input 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                      Há quanto tempo em operação?
                    </label>
                    <Select value={yearsInOperation} onValueChange={setYearsInOperation}>
                      <SelectTrigger className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos de 1 ano">Menos de 1 ano</SelectItem>
                        <SelectItem value="1-3 anos">1-3 anos</SelectItem>
                        <SelectItem value="3-5 anos">3-5 anos</SelectItem>
                        <SelectItem value="5-10 anos">5-10 anos</SelectItem>
                        <SelectItem value="mais de 10 anos">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Qual é o principal produto ou serviço que você oferece hoje?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={mainProducts} 
                      onChange={(e) => setMainProducts(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("mainProducts")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Qual é o seu público-alvo?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={targetAudience} 
                      onChange={(e) => setTargetAudience(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("targetAudience")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Sua empresa atua em qual canal?
                  </label>
                  <Select value={channelType} onValueChange={setChannelType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="físico">Físico</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Hoje, o seu modelo de vendas é mais:
                  </label>
                  <Select value={salesModel} onValueChange={setSalesModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reativo">Reativo (espera o cliente chegar)</SelectItem>
                      <SelectItem value="ativo">Ativo (vai atrás do cliente)</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Qual é o seu faturamento médio mensal?
                  </label>
                  <Select value={averageRevenue} onValueChange={setAverageRevenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5000">Até R$ 5.000</SelectItem>
                      <SelectItem value="20000">R$ 5.000 a R$ 20.000</SelectItem>
                      <SelectItem value="50000">R$ 20.000 a R$ 50.000</SelectItem>
                      <SelectItem value="100000">R$ 50.000 a R$ 100.000</SelectItem>
                      <SelectItem value="200000">R$ 100.000 a R$ 200.000</SelectItem>
                      <SelectItem value="500000">R$ 200.000 a R$ 500.000</SelectItem>
                      <SelectItem value="1000000">Acima de R$ 500.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Quantos funcionários fixos você tem hoje?
                  </label>
                  <Input 
                    type="number"
                    value={employeesCount} 
                    onChange={(e) => setEmployeesCount(e.target.value)} 
                    className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Quais ferramentas você usa para gerenciar sua empresa?
                  </label>
                  <Select value={managementTools} onValueChange={setManagementTools}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                      <SelectItem value="planilha">Planilha</SelectItem>
                      <SelectItem value="sistema">Sistema de gestão</SelectItem>
                      <SelectItem value="app">Aplicativo</SelectItem>
                      <SelectItem value="múltiplos">Múltiplas ferramentas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="documented-processes" 
                    checked={documentedProcesses} 
                    onCheckedChange={(checked) => setDocumentedProcesses(checked as boolean)} 
                  />
                  <label htmlFor="documented-processes" className="text-sm font-medium">
                    Você possui processos documentados?
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Qual é o maior desafio da sua empresa neste momento?
                  </label>
                  <div className="flex items-start gap-2">
                    <Textarea 
                      value={biggestChallenge} 
                      onChange={(e) => setBiggestChallenge(e.target.value)} 
                      className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
                    />
                    {renderAIButton("biggestChallenge")}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              {activeStep === 0 ? (
                <>
                  <div></div>
                  <Button 
                    type="button"
                    onClick={nextStep}
                    className={isDark 
                      ? "bg-pump-purple hover:bg-pump-purple/90 text-white" 
                      : "bg-pump-purple hover:bg-pump-purple/90 text-white"}
                  >
                    Próximo
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className={isDark 
                      ? "text-white dark:border-gray-700" 
                      : "text-pump-gray border-gray-300"}
                  >
                    Voltar
                  </Button>
                  
                  <Button 
                    type="submit"
                    className="bg-pump-purple hover:bg-pump-purple/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar perfil"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
