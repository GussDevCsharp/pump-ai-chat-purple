
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSignup } from "@/contexts/SignupContext";

export function useSignupSubmit() {
  const navigate = useNavigate();
  const {
    email,
    password,
    firstName,
    lastName,
    cpf,
    selectedPlanId,
    cardNumber,
    setIsLoading
  } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId || (!cardNumber && selectedPlanId !== 'free-plan')) {
      toast.error("Por favor, complete todos os campos obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            cpf
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (selectedPlanId !== 'free-plan' && cardNumber) {
        // Payment processing simulation would go here
      }
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Ocorreu um erro durante o cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}
