import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Login from "./Login";
import NotFound from "./NotFound";
import BusinessGenerator from "./BusinessGenerator";
import ThemesPage from "./Themes";
import Signup from "./Signup";
import AppointmentsPage from "./Appointments";
import React, { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Calendar } from "@/components/ui/calendar";
import { WeeklyKanban } from "@/components/appointments/WeeklyKanban";
import { Plus } from "lucide-react";
import { format, isSameWeek, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Themes() {
  const {
    appointments,
    isLoading,
    themes,
    create,
    update,
    remove,
  } = useAppointments();

  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Função para filtrar apenas os agendamentos da semana visível
  const weekAppointments = appointments?.filter((a: any) =>
    isSameWeek(new Date(a.start_time), selectedDate, { weekStartsOn: 0 })
  ) || [];

  function openCreateForm() {
    setFormInitialData(null);
    setShowForm(true);
  }

  function openEditForm(appt: any) {
    setFormInitialData({
      ...appt,
      date: parseISO(appt.start_time),
      start_time: appt.start_time && appt.start_time.slice(11, 16),
      end_time: appt.end_time && appt.end_time.slice(11, 16),
      theme_id: appt.theme_id,
    });
    setShowForm(true);
  }

  const handleSave = async (form: any) => {
    const date = form.date || selectedDate;
    const startDateTime = new Date(date);
    startDateTime.setHours(Number(form.start_time.split(":")[0]));
    startDateTime.setMinutes(Number(form.start_time.split(":")[1]));

    const endDateTime = new Date(date);
    endDateTime.setHours(Number(form.end_time.split(":")[0]));
    endDateTime.setMinutes(Number(form.end_time.split(":")[1]));

    if (form.id) {
      await update({
        id: form.id,
        title: form.title,
        theme_id: form.theme_id,
        description: form.description,
        location: form.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      });
    } else {
      await create({
        title: form.title,
        theme_id: form.theme_id,
        description: form.description,
        location: form.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-pump-offwhite p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Temas & Agendamentos</h1>
          <Button onClick={openCreateForm}>
            <Plus size={18} className="mr-2" /> Novo agendamento
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="shadow rounded-lg p-4 bg-pump-offwhite">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-white rounded"
            />
          </div>
          <div className="rounded-lg p-4 shadow-md bg-pump-offwhite">
            <h2 className="text-xl font-semibold mb-4">
              Agendamentos da semana de{" "}
              {format(selectedDate, "'Domingo' dd/MM")} a {format(selectedDate, "'Sábado' dd/MM")}
            </h2>
            {isLoading && <div>Carregando...</div>}
            {!isLoading && weekAppointments.length === 0 && <div>Nenhum agendamento esta semana.</div>}
            <WeeklyKanban
              baseDate={selectedDate}
              appointments={weekAppointments}
              onEdit={openEditForm}
              onDelete={remove}
            />
          </div>
        </div>

        <AppointmentForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          initialData={formInitialData}
          themes={themes}
        />
      </div>
    </div>
  );
}
