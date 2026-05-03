import { DateTime } from "luxon";
import { z } from "zod";

export const bookingRequestSchema = z
  .object({
    start: z.string().refine((value) => DateTime.fromISO(value).isValid, {
      message: "Selecciona un horario válido.",
    }),
    name: z.string().trim().min(2, "Escribe tu nombre."),
    email: z.string().trim().email("Escribe un correo válido."),
    company: z.string().trim().max(120).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
    notes: z.string().trim().max(1000).optional().default(""),
    website: z.string().trim().max(0, "Solicitud no válida.").optional(),
  })
  .transform((value) => ({
    ...value,
    company: value.company ?? "",
    phone: value.phone ?? "",
    notes: value.notes ?? "",
    website: value.website ?? "",
  }));

export type BookingRequestInput = z.input<typeof bookingRequestSchema>;
export type BookingRequestData = z.output<typeof bookingRequestSchema>;
