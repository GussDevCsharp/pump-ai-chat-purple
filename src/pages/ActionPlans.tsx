
import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ClipboardCheck, ClipboardList } from "lucide-react";
import { Header } from "@/components/common/Header";
import { ProfileCompletionAlert } from "@/components/common/ProfileCompletionAlert";
import { ProfileCompletionChart } from "@/components/profile/ProfileCompletionChart";
import { Copyright } from 'lucide-react';

interface ActionPlan {
  id: string;
  title: string;
  status: string;
  created_at: string;
  description?: string;
  prompt_id?: string;
  updated_at: string;
  user_id: string;
}

export default function ActionPlans() {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActionPlans() {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;

        const { data, error } = await supabase
          .from('action_plans')
          .select('*')
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Erro ao carregar planos de ação:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActionPlans();
  }, []);

  const handleNewChat = async () => {
    // This is just a placeholder function - you might want to implement the actual chat creation logic
    console.log('Criar novo chat');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProfileCompletionAlert />
      <Header />
      <main className="w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="w-full flex flex-col gap-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                <div className="w-full text-left">
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                    Planos de Ação
                  </h1>
                  <p className="text-lg text-pump-gray mb-6">
                    Acompanhe e gerencie seus planos de ação de forma centralizada.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleNewChat}
                      size="lg"
                      className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-lg px-7 py-3 text-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Novo Plano
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-8 
                  grid-cols-1
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4
                  w-full"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-[340px] animate-pulse bg-white/50" />
                  ))}
                </div>
              ) : plans.length === 0 ? (
                <Card className="p-8 text-center bg-white/90">
                  <p className="text-pump-gray">Você ainda não tem nenhum plano de ação.</p>
                  <p className="mt-2 text-pump-gray">Crie um plano a partir das sugestões no chat!</p>
                </Card>
              ) : (
                <div className="grid gap-8 
                  grid-cols-1
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4
                  w-full"
                >
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className="flex flex-col h-[340px] rounded-2xl border-2 border-pump-gray/10 
                        hover:shadow-2xl transform transition-all duration-200 cursor-pointer
                        hover:scale-105 shadow-md group bg-white/90 px-4 py-3"
                    >
                      <div className="flex flex-col flex-1 justify-between h-full p-2">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pump-purple/10">
                                {plan.status === 'completed' ? (
                                  <ClipboardCheck className="w-5 h-5 text-pump-purple" />
                                ) : (
                                  <ClipboardList className="w-5 h-5 text-pump-purple" />
                                )}
                              </div>
                              <h3 className="font-normal text-xl text-gray-900 leading-tight">
                                {plan.title}
                              </h3>
                            </div>
                          </div>
                          {plan.description && (
                            <p className="text-sm text-pump-gray mt-2 mb-2 px-1">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full py-2 px-5 rounded-lg font-normal border-pump-purple 
                              text-pump-purple hover:bg-pump-purple/10 hover:text-pump-purple 
                              bg-white transition-all"
                          >
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <ProfileCompletionChart />
          </div>
        </div>
      </main>
      <footer className="mt-auto bg-pump-offwhite border-t border-pump-gray/10 py-6">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between text-pump-gray">
          <div className="flex items-center gap-2 text-sm">
            <Copyright className="w-4 h-4" />
            <span>{new Date().getFullYear()} ChatPump. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-pump-purple transition-colors">Privacidade</a>
            <a href="#" className="hover:text-pump-purple transition-colors">Termos</a>
            <a href="#" className="hover:text-pump-purple transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

