
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/common/Header"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useTheme } from "@/hooks/useTheme"
import { useAIGeneration } from "@/hooks/useAIGeneration"
import { EntrepreneurProfileForm } from "@/components/profile/EntrepreneurProfileForm"
import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm"
import { ProfileFormNavigation } from "@/components/profile/ProfileFormNavigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [activeTab, setActiveTab] = useState("entrepreneur")
  const navigate = useNavigate()
  
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
  
  const handleSubmit = async () => {
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
    setActiveTab("company")
  }
  
  const prevStep = () => {
    setActiveTab("entrepreneur")
  }

  const currentStep = activeTab === "entrepreneur" ? 0 : 1

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">Complete seu perfil</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="entrepreneur" className="text-sm font-medium">
                🧠 Perfil do Empresário
              </TabsTrigger>
              <TabsTrigger value="company" className="text-sm font-medium">
                🏢 Perfil da Empresa
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <TabsContent value="entrepreneur" className="space-y-6">
                <EntrepreneurProfileForm
                  mainGoal={mainGoal}
                  setMainGoal={setMainGoal}
                  entrepreneurshipReason={entrepreneurshipReason}
                  setEntrepreneurshipReason={setEntrepreneurshipReason}
                  managementStyle={managementStyle}
                  setManagementStyle={setManagementStyle}
                  motivation={motivation}
                  setMotivation={setMotivation}
                  difficulties={difficulties}
                  setDifficulties={setDifficulties}
                  goalsReviewFrequency={goalsReviewFrequency}
                  setGoalsReviewFrequency={setGoalsReviewFrequency}
                  teamStatus={teamStatus}
                  setTeamStatus={setTeamStatus}
                  planningTimeWeekly={planningTimeWeekly}
                  setPlanningTimeWeekly={setPlanningTimeWeekly}
                  technologyInvestment={technologyInvestment}
                  setTechnologyInvestment={setTechnologyInvestment}
                  leadershipStyle={leadershipStyle}
                  setLeadershipStyle={setLeadershipStyle}
                  isGenerating={isGenerating}
                  onGenerateField={handleGenerateField}
                />
              </TabsContent>
              
              <TabsContent value="company" className="space-y-6">
                <CompanyProfileForm
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  yearsInOperation={yearsInOperation}
                  setYearsInOperation={setYearsInOperation}
                  mainProducts={mainProducts}
                  setMainProducts={setMainProducts}
                  targetAudience={targetAudience}
                  setTargetAudience={setTargetAudience}
                  channelType={channelType}
                  setChannelType={setChannelType}
                  salesModel={salesModel}
                  setSalesModel={setSalesModel}
                  averageRevenue={averageRevenue}
                  setAverageRevenue={setAverageRevenue}
                  employeesCount={employeesCount}
                  setEmployeesCount={setEmployeesCount}
                  managementTools={managementTools}
                  setManagementTools={setManagementTools}
                  documentedProcesses={documentedProcesses}
                  setDocumentedProcesses={setDocumentedProcesses}
                  biggestChallenge={biggestChallenge}
                  setBiggestChallenge={setBiggestChallenge}
                  isGenerating={isGenerating}
                  onGenerateField={handleGenerateField}
                />
              </TabsContent>
              
              <ProfileFormNavigation
                activeStep={currentStep}
                isLoading={isLoading}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                onSubmit={handleSubmit}
              />
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
