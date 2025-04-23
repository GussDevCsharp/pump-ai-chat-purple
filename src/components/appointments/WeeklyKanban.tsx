
import React from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WeeklyKanbanProps {
  baseDate?: Date; // Dia referência da semana (padrão: hoje)
  appointments: any[];
  onEdit?: (appt: any) => void;
  onDelete?: (id: string) => void;
}

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function WeeklyKanban({
  baseDate = new Date(),
  appointments,
  onEdit,
  onDelete,
}: WeeklyKanbanProps) {
  // Primeiro dia da semana: domingo
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });

  return (
    <div className="grid grid-cols-7 gap-2 bg-white rounded-lg shadow p-2">
      {Array.from({ length: 7 }).map((_, idx) => {
        const day = addDays(weekStart, idx);
        const dayAppts = appointments.filter((appt) =>
          isSameDay(new Date(appt.start_time), day)
        );

        return (
          <div key={idx} className="flex flex-col h-[360px]">
            <div className="mb-2 text-center font-semibold text-sm text-pump-purple">
              {weekDays[idx]}
              <div className="text-xs text-gray-500">
                {format(day, "dd/MM")}
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {dayAppts.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center">Sem agendamentos</div>
              ) : (
                dayAppts.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="bg-pump-offwhite border rounded p-2 mb-1 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{appt.title}</div>
                      {appt.theme && (
                        <Badge style={{ background: appt.theme.color }} className="ml-auto">{appt.theme.name}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {format(new Date(appt.start_time), "HH:mm")} - {appt.location || "sem local"}
                    </div>
                    {appt.description && (
                      <div className="text-xs text-gray-500 truncate">{appt.description}</div>
                    )}
                    <div className="flex gap-1 mt-1">
                      {onEdit && (
                        <Button size="xs" variant="outline" onClick={() => onEdit(appt)}>
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button size="xs" variant="destructive" onClick={() => onDelete(appt.id)}>
                          Excluir
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
