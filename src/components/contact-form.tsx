"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import { serviceInterestOptions } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type ContactStatus = "idle" | "loading" | "success" | "error";
type ContactApiResult = {
  message?: string;
  issues?: Partial<Record<string, string[]>>;
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setStatus("loading");
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      serviceInterest: String(formData.get("serviceInterest") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactApiResult;

      if (!response.ok) {
        setStatus("error");
        setMessage(getContactErrorMessage(result));
        return;
      }

      setStatus("success");
      setMessage(result.message ?? "Recibimos tu mensaje.");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setMessage("No pudimos enviar tu mensaje. Inténtalo más tarde.");
    }
  }

  return (
    <form
      id="formulario-contacto"
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-soft"
    >
      <input
        className="hidden"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" name="name" required />
        <Field label="Correo" name="email" type="email" required />
        <Field label="Teléfono" name="phone" />
        <Field label="Empresa" name="company" />
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-white/80">
        Servicio de interés
        <select
          className="h-12 rounded-md border border-white/10 bg-sireon-ink/50 px-3 text-sm text-white outline-none transition focus:border-sireon-cyan focus:ring-2 focus:ring-sireon-cyan/30"
          name="serviceInterest"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {serviceInterestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-sm font-bold text-white/80">
        Mensaje
        <textarea
          className="min-h-32 rounded-md border border-white/10 bg-sireon-ink/50 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-sireon-cyan focus:ring-2 focus:ring-sireon-cyan/30"
          name="message"
          placeholder="Cuéntanos qué quieres mejorar o automatizar."
          required
        />
      </label>
      <button
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,#00E5FF,#19F6B1)] px-5 text-sm font-bold text-sireon-ink transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sireon-cyan focus:ring-offset-2 focus:ring-offset-sireon-ink disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="h-4 w-4" />
        )}
        Enviar mensaje
      </button>
      {message ? (
        <p
          className={cn(
            "mt-4 rounded-lg border p-3 text-sm",
            status === "success"
              ? "border-sireon-emerald/30 bg-sireon-emerald/10 text-white"
              : "border-white/10 bg-white/10 text-white/70",
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
  );
}

function getContactErrorMessage(result: ContactApiResult): string {
  const fieldErrors = result.issues ?? {};
  const firstFieldError = Object.values(fieldErrors).find(
    (errors) => errors && errors.length > 0,
  )?.[0];

  return firstFieldError ?? result.message ?? "No pudimos enviar tu mensaje.";
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
        className="h-12 rounded-md border border-white/10 bg-sireon-ink/50 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-sireon-cyan focus:ring-2 focus:ring-sireon-cyan/30"
        name={name}
        type={type}
        required={required}
      />
    </label>
  );
}
