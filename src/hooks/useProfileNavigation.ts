
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useProfileNavigation() {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          setIsProfileComplete(null);
          setIsLoading(false);
          return;
        }
        
        const userId = session.session.user.id;
        
        // Check if company profile is complete
        const { data: companyProfile } = await supabase
          .from('company_profiles')
          .select('profile_completed')
          .eq('user_id', userId)
          .maybeSingle();
          
        setIsProfileComplete(companyProfile?.profile_completed || false);
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProfileStatus();
  }, []);

  const redirectToProfileIfNeeded = () => {
    if (isProfileComplete === false) {
      navigate('/profile-complete');
      return true;
    }
    return false;
  };

  return { isProfileComplete, isLoading, redirectToProfileIfNeeded };
}
