
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAppointments = () => {
  const queryClient = useQueryClient();

  // Fetch all events for the current user with mock data
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const mockAppointments = [
        {
          id: '1',
          title: 'Reunião com Investidores',
          start_time: '2025-04-27T14:30:00Z',
          end_time: '2025-04-27T16:00:00Z',
          description: 'Apresentação do plano de negócios',
          theme_id: '1',
          theme: { id: '1', name: 'Negócios', color: '#7E1CC6' }
        },
        {
          id: '2',
          title: 'Workshop de Marketing Digital',
          start_time: '2025-04-28T10:00:00Z',
          end_time: '2025-04-28T12:00:00Z',
          description: 'Estratégias para redes sociais',
          theme_id: '2',
          theme: { id: '2', name: 'Marketing', color: '#2E86C1' }
        },
        {
          id: '3',
          title: 'Planejamento Estratégico',
          start_time: '2025-04-29T15:00:00Z',
          end_time: '2025-04-29T17:00:00Z',
          description: 'Definição de metas para Q2',
          theme_id: '3',
          theme: { id: '3', name: 'Planejamento', color: '#27AE60' }
        }
      ];

      return mockAppointments;
    }
  });

  // Fetch themes with mock data
  const { data: themes } = useQuery({
    queryKey: ["chat_themes"],
    queryFn: async () => {
      const mockThemes = [
        { id: '1', name: 'Negócios', color: '#7E1CC6' },
        { id: '2', name: 'Marketing', color: '#2E86C1' },
        { id: '3', name: 'Planejamento', color: '#27AE60' },
        { id: '4', name: 'Vendas', color: '#F39C12' }
      ];
      
      return mockThemes;
    }
  });

  // Create event
  const createMutation = useMutation({
    mutationFn: async (appt: any) => {
      // For mock purposes, just return the appointment with an ID
      console.log("Creating appointment:", appt);
      return { ...appt, id: 'new-' + Date.now() };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Update event
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...appt }: any) => {
      // For mock purposes, just return the updated appointment
      console.log("Updating appointment:", id, appt);
      return { id, ...appt };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Delete event
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // For mock purposes, just log the deletion
      console.log("Deleting appointment:", id);
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return {
    appointments,
    isLoading,
    error,
    themes,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
};
