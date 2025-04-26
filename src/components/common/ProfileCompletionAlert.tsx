
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export function ProfileCompletionAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) return

        const { data: companyProfile, error: companyError } = await supabase
          .from('company_profiles')
          .select('id, profile_completed')
          .eq('user_id', session.session.user.id)
          .single()
        
        if (companyError && companyError.code !== 'PGRST116') {
          console.error('Error checking company profile:', companyError)
          return
        }
        
        if (!companyProfile || !companyProfile.profile_completed) {
          setShowAlert(true)
        }
      } catch (error) {
        console.error('Error checking profile completion:', error)
      }
    }
    
    const timer = setTimeout(checkProfileCompletion, 1000)
    return () => clearTimeout(timer)
  }, [])
  
  const handleComplete = () => {
    navigate('/profile/complete')
    setShowAlert(false)
  }
  
  const handleLater = () => {
    setShowAlert(false)
  }
  
  if (!showAlert) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-pump-purple" />
            <span className="text-sm font-medium">
              Deixa eu conhecer seu negócio ainda mais
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLater}
            >
              Depois
            </Button>
            <Button 
              size="sm"
              onClick={handleComplete}
              className="bg-pump-purple hover:bg-pump-purple/90"
            >
              Completar perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
