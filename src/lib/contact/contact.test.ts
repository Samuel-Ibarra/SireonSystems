import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./schema";

describe("contactFormSchema", () => {
  it("accepts a valid lead payload", () => {
    const result = contactFormSchema.safeParse({
      name: "Ana Lopez",
      email: "ana@example.com",
      phone: "+52 55 1234 5678",
      company: "Operadora Norte",
      serviceInterest: "Automatizaciones con IA",
      message: "Quiero reducir tareas manuales en mi equipo comercial.",
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid emails and short messages", () => {
    const result = contactFormSchema.safeParse({
      name: "A",
      email: "correo-invalido",
      phone: "",
      company: "",
      serviceInterest: "",
      message: "Hola",
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("explains when the message is too short", () => {
    const result = contactFormSchema.safeParse({
      name: "Ana Lopez",
      email: "ana@example.com",
      phone: "",
      company: "",
      serviceInterest: "Automatizaciones con IA",
      message: "Hola",
      website: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toEqual([
        "Cuéntanos un poco más para poder orientarte.",
      ]);
    }
  });

  it("rejects honeypot submissions", () => {
    const result = contactFormSchema.safeParse({
      name: "Ana Lopez",
      email: "ana@example.com",
      phone: "+52 55 1234 5678",
      company: "Operadora Norte",
      serviceInterest: "Sitio web",
      message: "Quiero mejorar mi presencia digital.",
      website: "spam.example",
    });

    expect(result.success).toBe(false);
  });
});
