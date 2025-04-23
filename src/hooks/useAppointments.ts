
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAppointments = () => {
  const queryClient = useQueryClient();

  // Fetch all events for the current user
  const { data, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
            *,
            category:appointment_categories(id, name, color)
          `
        )
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch appointment categories
  const { data: categories } = useQuery({
    queryKey: ["appointment_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointment_categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  // Create event
  const createMutation = useMutation({
    mutationFn: async (appt: any) => {
      const { data, error } = await supabase.from("appointments").insert([appt]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Update event
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...appt }: any) => {
      const { data, error } = await supabase.from("appointments").update(appt).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Delete event
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  // Create category
  const createCategoryMutation = useMutation({
    mutationFn: async (cat: any) => {
      const { data, error } = await supabase.from("appointment_categories").insert([cat]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointment_categories"] }),
  });

  return {
    appointments: data,
    isLoading,
    error,
    categories,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    createCategory: createCategoryMutation.mutateAsync,
  };
};
