import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useLocation } from 'react-router-dom'

const MAX_ANON_INTERACTIONS = 10;
const INTERACTIONS_STORAGE_KEY = 'chat_interactions_today';

export type AuthStatus = 'authenticated' | 'anonymous';

export const useChatAuth = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('anonymous');
  const [user, setUser] = useState<any>(null);
  const [dailyInteractionsCount, setDailyInteractionsCount] = useState<number>(0);
  const [remainingInteractions, setRemainingInteractions] = useState<number>(MAX_ANON_INTERACTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const isChatRoute = location.pathname === "/chat";

  // Load interactions count from localStorage and reset if it's a new day
  useEffect(() => {
    const checkDailyInteractions = () => {
      const storedData = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
      
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        const today = new Date().toDateString();
        
        if (date === today) {
          setDailyInteractionsCount(count);
          setRemainingInteractions(MAX_ANON_INTERACTIONS - count);
        } else {
          // Reset for a new day
          localStorage.setItem(
            INTERACTIONS_STORAGE_KEY, 
            JSON.stringify({ date: today, count: 0 })
          );
          setDailyInteractionsCount(0);
          setRemainingInteractions(MAX_ANON_INTERACTIONS);
        }
      } else {
        // First time using the app
        const today = new Date().toDateString();
        localStorage.setItem(
          INTERACTIONS_STORAGE_KEY, 
          JSON.stringify({ date: today, count: 0 })
        );
        setDailyInteractionsCount(0);
        setRemainingInteractions(MAX_ANON_INTERACTIONS);
      }
    };

    checkDailyInteractions();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          setAuthStatus('authenticated');
          setUser(data.session.user);
        } else {
          setAuthStatus('anonymous');
          setUser(null);
        }
      } catch (error: any) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setAuthStatus('authenticated');
          setUser(session.user);
        } else {
          setAuthStatus('anonymous');
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to record a chat interaction
  const recordInteraction = () => {
    if (authStatus === 'authenticated') {
      // Authenticated users don't have interaction limits
      return true;
    }

    // For anonymous users, check and update daily limit
    const storedData = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      const today = new Date().toDateString();
      
      if (date === today) {
        if (count >= MAX_ANON_INTERACTIONS) {
          // Remove toast notification in chat screen
          if (!isChatRoute) {
            // If we needed to show a notification, we'd do it here
            console.log("Limite atingido: Você atingiu o limite de 10 interações por dia. Faça login para continuar.");
          }
          return false;
        }
        
        // Update count
        const newCount = count + 1;
        localStorage.setItem(
          INTERACTIONS_STORAGE_KEY, 
          JSON.stringify({ date: today, count: newCount })
        );
        setDailyInteractionsCount(newCount);
        setRemainingInteractions(MAX_ANON_INTERACTIONS - newCount);
        return true;
      }
    }
    
    // First interaction of the day
    const today = new Date().toDateString();
    localStorage.setItem(
      INTERACTIONS_STORAGE_KEY, 
      JSON.stringify({ date: today, count: 1 })
    );
    setDailyInteractionsCount(1);
    setRemainingInteractions(MAX_ANON_INTERACTIONS - 1);
    return true;
  };

  // Função para realizar logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthStatus('anonymous');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error };
    }
  };

  return { 
    authStatus, 
    user, 
    isLoading,
    dailyInteractionsCount, 
    remainingInteractions,
    recordInteraction,
    logout
  };
};
