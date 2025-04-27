
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, ClipboardList } from "lucide-react";

interface ActionPlan {
  id: string;
  title: string;
  status: string; // Changed from 'pending' | 'completed' to string to match database
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

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-pump-purple" />
          <h1 className="text-2xl font-bold text-gray-900">Meus Planos de Ação</h1>
        </div>

        {plans.length === 0 ? (
          <Card className="bg-white/90">
            <CardContent className="p-8 text-center text-gray-500">
              <p>Você ainda não tem nenhum plano de ação.</p>
              <p className="mt-2">Crie um plano a partir das sugestões no chat!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-white/90">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {plan.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-gray-500">
                      Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {plan.status === 'completed' ? (
                    <ClipboardCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardList className="h-5 w-5 text-pump-purple/70" />
                  )}
                </CardHeader>
                {plan.description && (
                  <CardContent>
                    <p className="text-gray-600">{plan.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
