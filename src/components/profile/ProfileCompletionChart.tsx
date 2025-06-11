import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ptBR } from 'date-fns/locale';

export function ProfileCompletionChart() {
  const [companyCompleted, setCompanyCompleted] = useState(false);
  const [entrepreneurCompleted, setEntrepreneurCompleted] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('profile_completed')
        .eq('user_id', session.session.user.id)
        .single();

      const { data: entrepreneurProfile } = await supabase
        .from('entrepreneur_profiles')
        .select('id')
        .eq('user_id', session.session.user.id)
        .single();

      setCompanyCompleted(!!companyProfile?.profile_completed);
      setEntrepreneurCompleted(!!entrepreneurProfile?.id);
      setIsLoading(false);
    };

    checkProfileCompletion();
  }, []);

  const calculateCompletion = () => {
    let total = 20; // Base authentication
    if (companyCompleted) total += 40;
    if (entrepreneurCompleted) total += 40;
    return total;
  };

  const completion = calculateCompletion();
  const remaining = 100 - completion;

  const data = [
    { name: 'Completed', value: completion },
    { name: 'Remaining', value: remaining }
  ];

  const COLORS = ['#7E1CC6', '#f4ebfd'];

  return (
    <div className="space-y-4">
      <Card className="p-6 w-[300px]">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            O quanto eu sei de você
          </h3>
          <p className="text-sm text-pump-gray">
            Complete seu perfil para aproveitar todos os recursos
          </p>
        </div>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
                <Label
                  value={`${completion}%`}
                  position="center"
                  className="text-xl font-bold"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-pump-gray">Login básico</span>
            <span className="font-medium">✨ {companyCompleted ? 'Oi!' : 'Olá!'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-pump-gray">Perfil da empresa</span>
            <span className="font-medium">{companyCompleted ? '✅ Conhecida' : '🤔 Quem é?'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-pump-gray">Perfil do empresário</span>
            <span className="font-medium">{entrepreneurCompleted ? '🤝 Você por aqui!' : '👋 Vem cá!'}</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 w-[300px] bg-white">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Agenda
          </h3>
          <p className="text-sm text-pump-gray">
            Marque seus compromissos
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ptBR}
          className="rounded-md bg-white pointer-events-auto"
        />
      </Card>
    </div>
  );
}
