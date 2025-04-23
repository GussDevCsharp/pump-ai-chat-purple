
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { Plus } from "lucide-react";

const offwhite = "bg-pump-offwhite";

export default function AppointmentsPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState<any>(null);
  const {
    appointments,
    isLoading,
    themes,
    create,
    update,
    remove,
  } = useAppointments();

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
    const date = form.date || selectedDay;
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

  // Events filtered by selected day
  const dayAppointments = appointments?.filter((a: any) =>
    isSameDay(new Date(a.start_time), selectedDay)
  );

  return (
    <div className={`min-h-screen ${offwhite} p-4`}>
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Agenda</h1>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2" size={18} /> Novo agendamento
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`shadow rounded-lg p-4 ${offwhite}`}>
            <Calendar mode="single" selected={selectedDay} onSelect={setSelectedDay} className="bg-white rounded" />
          </div>
          <div className={`rounded-lg p-4 shadow-md ${offwhite}`}>
            <h2 className="text-xl font-semibold mb-4">
              Agendamentos do dia {selectedDay && format(selectedDay, "dd/MM/yyyy")}
            </h2>
            {isLoading && <div>Carregando...</div>}
            {!isLoading && dayAppointments?.length === 0 && <div>Nenhum agendamento para este dia.</div>}
            <ul className="space-y-3">
              {dayAppointments?.map((appt: any) => (
                <li key={appt.id} className="border rounded p-3 flex justify-between items-center bg-white">
                  <div>
                    <div className="font-medium text-lg">{appt.title}</div>
                    {appt.theme && (
                      <Badge style={{ background: appt.theme.color }}>{appt.theme.name}</Badge>
                    )}
                    <div className="text-xs">
                      {format(new Date(appt.start_time), "HH:mm")} - {format(new Date(appt.end_time), "HH:mm")}
                    </div>
                    {appt.location && <div className="text-xs">Local: {appt.location}</div>}
                    {appt.description && <div className="text-xs mt-1">{appt.description}</div>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditForm(appt)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(appt.id)}>Excluir</Button>
                  </div>
                </li>
              ))}
            </ul>
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
