import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ptBR } from 'date-fns/locale';
import { useAppointments } from "@/hooks/useAppointments";
import { CalendarClock } from "lucide-react";

export function ProfileCompletionChart() {
  const [companyCompleted, setCompanyCompleted] = useState(false);
  const [entrepreneurCompleted, setEntrepreneurCompleted] = useState(false);
  const [date, setDate] = useState<Date>();
  const { appointments, isLoading } = useAppointments();

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
          className="rounded-md bg-pump-offwhite pointer-events-auto"
        />
      </Card>

      <Card className="p-6 w-[300px] bg-white">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <CalendarClock className="w-5 h-5 text-pump-purple" />
            <h3 className="text-lg font-semibold text-gray-900">
              Próximas Atividades
            </h3>
          </div>
          <p className="text-sm text-pump-gray mt-1">
            Seus compromissos agendados
          </p>
        </div>
        
        <div className="space-y-3 mt-4">
          {isLoading ? (
            <p className="text-center text-sm text-pump-gray">Carregando...</p>
          ) : appointments && appointments.length > 0 ? (
            appointments.slice(0, 3).map((appointment) => (
              <div 
                key={appointment.id} 
                className="p-3 bg-pump-offwhite rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <p className="text-sm text-pump-gray mt-1">
                      {new Date(appointment.start_time).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-pump-gray">
              Nenhuma atividade agendada
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
