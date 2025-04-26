
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"

export function ProfileCompletionAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) return

        // Check if company profile exists and is complete
        const { data: companyProfile, error: companyError } = await supabase
          .from('company_profiles')
          .select('id, profile_completed')
          .eq('user_id', session.session.user.id)
          .single()
        
        if (companyError && companyError.code !== 'PGRST116') {
          console.error('Error checking company profile:', companyError)
          return
        }
        
        // If profile doesn't exist or is not complete, show alert
        if (!companyProfile || !companyProfile.profile_completed) {
          setShowAlert(true)
        }
      } catch (error) {
        console.error('Error checking profile completion:', error)
      }
    }
    
    // Add a small delay to ensure this runs after the auth state is fully initialized
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
  
  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-pump-purple">Complete seu perfil</AlertDialogTitle>
          <AlertDialogDescription>
            Para uma melhor experiência, precisamos de mais informações sobre você e sua empresa.
            Complete seu perfil para desbloquear todos os recursos da plataforma.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLater}>Depois</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleComplete}
            className="bg-pump-purple hover:bg-pump-purple/90"
          >
            Completar perfil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
