"use client";

import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type Slot = {
  start: string;
  end: string;
  date: string;
  label: string;
};

type BookingStatus = "idle" | "loading" | "success" | "error";

export function BookingScheduler() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      try {
        const response = await fetch("/api/calendar/availability", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          slots?: Slot[];
          message?: string;
        };

        if (!isMounted) return;

        if (!response.ok) {
          setSlotsMessage(
            payload.message ??
              "No pudimos cargar disponibilidad. Escríbenos por WhatsApp o formulario.",
          );
          return;
        }

        setSlots(payload.slots ?? []);
        setSelectedSlot(payload.slots?.[0] ?? null);
      } catch {
        if (isMounted) {
          setSlotsMessage(
            "No pudimos cargar disponibilidad. Escríbenos por WhatsApp o formulario.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingSlots(false);
        }
      }
    }

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedSlots = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((groups, slot) => {
      groups[slot.date] = groups[slot.date] ?? [];
      groups[slot.date].push(slot);
      return groups;
    }, {});
  }, [slots]);

  async function handleSubmit(formData: FormData) {
    if (!selectedSlot) {
      setMessage("Selecciona un horario para continuar.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const payload = {
      start: selectedSlot.start,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/calendar/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.message ?? "No pudimos agendar la llamada.");
        return;
      }

      setStatus("success");
      setMessage(
        result.message ??
          "Tu llamada quedó agendada. Revisa tu correo para la invitación.",
      );
    } catch {
      setStatus("error");
      setMessage("No pudimos agendar la llamada. Inténtalo más tarde.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sireon-cyan/10 text-sireon-cyan shadow-neon">
            <CalendarDays aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              Horarios disponibles
            </h3>
            <p className="text-sm text-white/60">
              Lunes a viernes, 9:00 a 18:00.
            </p>
          </div>
        </div>

        {loadingSlots ? (
          <div className="mt-8 flex min-h-40 items-center justify-center text-white/60">
            <Loader2 aria-hidden="true" className="mr-2 h-5 w-5 animate-spin" />
            Cargando disponibilidad
          </div>
        ) : slotsMessage ? (
          <p className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            {slotsMessage}
          </p>
        ) : (
          <div className="mt-6 max-h-[460px] space-y-5 overflow-y-auto pr-2">
            {Object.entries(groupedSlots).map(([date, daySlots]) => (
              <div key={date}>
                <p className="mb-3 text-sm font-bold capitalize text-white">
                  {formatDate(date)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {daySlots.map((slot) => {
                    const selected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        key={slot.start}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sireon-cyan focus:ring-offset-2 focus:ring-offset-sireon-ink",
                          selected
                            ? "border-sireon-cyan bg-sireon-cyan text-sireon-ink shadow-neon"
                            : "border-white/10 bg-sireon-ink/50 text-white/80 hover:border-sireon-cyan hover:text-white",
                        )}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        action={handleSubmit}
        className="rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,62,165,0.16),rgba(47,128,255,0.1)_42%,rgba(25,246,177,0.08))] p-5 text-white shadow-ember"
      >
        <h3 className="font-display text-xl font-bold">Reserva tu diagnóstico</h3>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Comparte tus datos y enviaremos la invitación con Google Meet.
        </p>

        <input
          className="hidden"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="mt-5 grid gap-3">
          <Field label="Nombre" name="name" required />
          <Field label="Correo" name="email" type="email" required />
          <Field label="Teléfono" name="phone" />
          <Field label="Empresa" name="company" />
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Notas
            <textarea
              className="min-h-28 rounded-md border border-white/10 bg-sireon-ink/50 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-sireon-cyan focus:ring-2 focus:ring-sireon-cyan/30"
              name="notes"
              placeholder="¿Qué proceso, sitio o integración quieres mejorar?"
            />
          </label>
        </div>

        <button
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,#FF3EA5,#FF7A3D)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sireon-ink disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "loading" || !selectedSlot}
          type="submit"
        >
          {status === "loading" ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : null}
          Confirmar llamada
        </button>

        {message ? (
          <p
            className={cn(
              "mt-4 rounded-lg border p-3 text-sm",
              status === "success"
                ? "border-sireon-emerald/30 bg-sireon-emerald/10 text-white"
                : "border-white/10 bg-white/10 text-white",
            )}
            role="status"
          >
            {status === "success" ? (
              <CheckCircle2
                aria-hidden="true"
                className="mr-2 inline h-4 w-4 text-sireon-mint"
              />
            ) : null}
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/80">
      {label}
      <input
        className="h-11 rounded-md border border-white/10 bg-sireon-ink/50 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-sireon-cyan focus:ring-2 focus:ring-sireon-cyan/30"
        name={name}
        type={type}
        required={required}
      />
    </label>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}
