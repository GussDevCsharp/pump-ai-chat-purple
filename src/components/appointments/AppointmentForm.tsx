
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  themes?: { id: string; name: string; color: string }[];
}

export function AppointmentForm({ open, onClose, onSubmit, initialData, themes }: AppointmentFormProps) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      date: new Date(),
      start_time: "",
      end_time: "",
      location: "",
      theme_id: themes?.[0]?.id ?? null,
    }
  );
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!initialData && themes && themes[0] && !form.theme_id) {
      setForm((f) => ({ ...f, theme_id: themes[0].id }));
    }
  }, [themes, initialData]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>{initialData ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            await onSubmit(form);
            setSaving(false);
            onClose();
          }}>
          <Input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-pump-offwhite"
          />
          <Input
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="bg-pump-offwhite"
          />
          <div>
            <label className="text-sm mb-1 inline-block">Data</label>
            <Calendar
              mode="single"
              selected={form.date}
              onSelect={(d) => setForm({ ...form, date: d! })}
              className="bg-pump-offwhite rounded"
            />
          </div>
          <div className="flex gap-2">
            <Input
              name="start_time"
              type="time"
              value={form.start_time}
              onChange={handleChange}
              required
              className="bg-pump-offwhite"
            />
            <Input
              name="end_time"
              type="time"
              value={form.end_time}
              onChange={handleChange}
              required
              className="bg-pump-offwhite"
            />
          </div>
          <Input
            name="location"
            placeholder="Local"
            value={form.location}
            onChange={handleChange}
            className="bg-pump-offwhite"
          />
          <div>
            <label className="text-sm mb-1 block">Tema</label>
            <select
              name="theme_id"
              value={form.theme_id ?? ""}
              onChange={handleChange}
              className="w-full bg-pump-offwhite rounded border px-2 py-1"
              required
            >
              {themes?.map((t) => (
                <option value={t.id} key={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
