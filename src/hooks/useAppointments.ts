
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAppointments = () => {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const mockAppointments = [
        {
          id: '1',
          title: 'Reunião com Investidores',
          start_time: '2025-04-27T14:30:00Z',
          description: 'Apresentação do plano de negócios'
        },
        {
          id: '2',
          title: 'Workshop de Marketing Digital',
          start_time: '2025-04-28T10:00:00Z',
          description: 'Estratégias para redes sociais'
        },
        {
          id: '3',
          title: 'Planejamento Estratégico',
          start_time: '2025-04-29T15:00:00Z',
          description: 'Definição de metas para Q2'
        }
      ];

      return mockAppointments;
    }
  });

  return {
    appointments,
    isLoading,
    error
  };
};
