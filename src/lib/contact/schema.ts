import { z } from "zod";

export const serviceInterestOptions = [
  "Sitio web corporativo",
  "Landing page",
  "Automatizaciones con IA",
  "Chatbots e integraciones",
  "Diagnóstico general",
] as const;

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, "Escribe tu nombre."),
    email: z.string().trim().email("Escribe un correo válido."),
    phone: z.string().trim().max(40).optional().default(""),
    company: z.string().trim().max(120).optional().default(""),
    serviceInterest: z.string().trim().min(2, "Selecciona un servicio."),
    message: z
      .string()
      .trim()
      .min(20, "Cuéntanos un poco más para poder orientarte."),
    website: z.string().trim().max(0, "Solicitud no válida.").optional(),
  })
  .transform((value) => ({
    ...value,
    phone: value.phone ?? "",
    company: value.company ?? "",
    website: value.website ?? "",
  }));

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;
