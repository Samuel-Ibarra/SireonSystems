import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Mail,
  MessageCircle,
  PhoneCall,
  Plus,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { AnimatedVideo } from "@/components/animated-video";
import { BookingScheduler } from "@/components/booking-scheduler";
import { ContactForm } from "@/components/contact-form";
import { CtaLink } from "@/components/cta-link";
import { ScrollReveal, ScrollRevealController } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { SireonLogo } from "@/components/sireon-logo";
import { faqs, painPoints, processSteps, services } from "@/lib/site-content";

const trustSignals = [
  {
    title: "Resultados medibles",
    copy: "Impacto real en tu negocio",
    icon: Zap,
    color: "text-sireon-emerald",
  },
  {
    title: "Implementación segura",
    copy: "Datos y procesos protegidos",
    icon: LockKeyhole,
    color: "text-sireon-coral",
  },
  {
    title: "Escalable contigo",
    copy: "Crece sin límites",
    icon: BarChart3,
    color: "text-sireon-violet",
  },
];

const caseHighlights = [
  ["Solicitud a propuesta", "Captura, califica y dispara seguimiento automático."],
  ["Atención conectada", "WhatsApp, correo y formularios con contexto compartido."],
  ["Dirección visible", "Reportes claros para decidir dónde invertir esfuerzo."],
];

const agendaBenefits = [
  ["En línea y en vivo", "Elige el horario que mejor te convenga.", CalendarDays],
  ["Sin compromiso", "Es una llamada informativa y sin costo.", Clock3],
  ["100% confidencial", "Tu información está segura con nosotros.", ShieldCheck],
] as const;

export default function Home() {
  const whatsappHref = buildWhatsappHref();

  return (
    <main className="relative isolate overflow-hidden text-white">
      <SiteHeader whatsappHref={whatsappHref} />
      <ScrollRevealController />

      <section
        id="inicio"
        className="relative border-b border-white/10"
      >
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pb-14 pt-14 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-16">
          <ScrollReveal className="min-w-0">
            <h1 className="max-w-3xl break-words font-display text-[clamp(1.55rem,6.6vw,3.9rem)] font-extrabold leading-[1.04] tracking-normal text-white [overflow-wrap:anywhere] sm:text-[clamp(2.15rem,8vw,3.9rem)] lg:text-[clamp(2.6rem,4.45vw,3.9rem)]">
              Sitios web, automatización e{" "}
              <br className="sm:hidden" />
              <span className="bg-[linear-gradient(135deg,#FF3EA5,#FF7A3D)] bg-clip-text text-transparent">
                IA
              </span>{" "}
              para negocios{" "}
              <br className="sm:hidden" />
              que quieren{" "}
              <br className="sm:hidden" />
              operar mejor
            </h1>
            <p className="mt-6 max-w-[21rem] text-base leading-8 text-white/70 sm:max-w-2xl sm:text-lg">
              Implementamos tecnología a la medida para PyMEs en México que
              buscan crecer, vender más y atender mejor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="#agenda">
                Agendar diagnóstico
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CtaLink>
              <CtaLink href={whatsappHref} target="_blank" variant="secondary">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
              </CtaLink>
            </div>
            <div className="mt-9 grid gap-4 text-sm font-bold text-white/80 sm:grid-cols-3">
              {trustSignals.map((signal, index) => (
                <ScrollReveal
                  key={signal.title}
                  className="flex min-w-0 items-start gap-3"
                  delay={120 + index * 80}
                >
                  <signal.icon
                    aria-hidden="true"
                    className={`mt-1 h-5 w-5 shrink-0 ${signal.color}`}
                  />
                  <div className="min-w-0">
                    <p className="text-white">{signal.title}</p>
                    <p className="mt-1 text-xs font-semibold text-white/50">
                      {signal.copy}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="min-w-0" delay={160}>
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[0_0_80px_rgba(0,229,255,0.12)]">
              <AnimatedVideo
                className="aspect-[4/3] w-full"
                poster="/animations/hero-automation-poster.png"
                src="/animations/hero-automation.mp4"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <ScrollReveal>
            <SectionHeading
            tone="light"
            title="Tu negocio necesita procesos, no más tareas manuales."
            description="Una buena landing no solo se ve profesional. Explica, filtra, conecta y empuja al prospecto al siguiente paso."
          />
          </ScrollReveal>
          <div className="grid gap-4">
            {painPoints.map((point, index) => (
              <ScrollReveal
                key={point}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
                delay={index * 80}
              >
                <span className="font-display text-3xl font-extrabold text-sireon-cyan">
                  0{index + 1}
                </span>
                <p className="text-lg font-bold leading-7 text-white/90">{point}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="servicios"
        className="py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="min-w-0">
              <SectionHeading
                tone="light"
                title="Servicios que resuelven lo importante."
                description="Diseñamos un sistema conectado: presencia digital, automatización, atención y datos operando con una sola intención comercial."
              />
              <div className="mt-8 grid gap-4">
                {services.map((service, index) => (
                  <article
                    key={service.title}
                    className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sireon-cyan shadow-neon">
                      <service.icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-white/40">
                        0{index + 1}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-white">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {service.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-[0_0_80px_rgba(139,92,246,0.16)]">
              <AnimatedVideo
                className="aspect-[4/3] w-full"
                poster="/animations/services-orbit-poster.png"
                sizes="(min-width: 1024px) 48vw, 100vw"
                src="/animations/services-orbit.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="proceso" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            tone="light"
            title="Un método claro para lograr resultados reales."
            description="Trabajamos con una ruta simple para que sepas qué se construye, por qué importa y cómo se opera después."
          />
          <div className="relative grid gap-7">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="grid grid-cols-[auto_1fr] gap-5"
              >
                <div className="flex flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(0,229,255,0.34),rgba(255,122,61,0.22))] font-display text-lg font-extrabold text-white shadow-neon">
                    {index + 1}
                  </span>
                  {index < processSteps.length - 1 ? (
                    <span className="mt-3 h-16 w-px bg-[linear-gradient(180deg,#00E5FF,#FF7A3D)] opacity-50" />
                  ) : null}
                </div>
                <div className="min-w-0 pb-2">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-sireon-emerald">
                    <step.icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="casos"
        className="py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              tone="light"
              title="Un diagnóstico breve puede revelar dónde recuperar tiempo y ventas."
              description="Revisamos tu sitio, tus canales de atención, tus tareas repetidas y las herramientas que ya usas para definir una ruta simple de mejora."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {caseHighlights.map(([title, copy]) => (
                <article
                  key={title}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-6 w-6 text-sireon-emerald"
                  />
                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="agenda"
        className="py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionHeading
              tone="light"
              title="Agendemos tu diagnóstico sin costo."
              description="30 minutos para conocer tu negocio, resolver dudas y encontrar oportunidades reales de crecimiento."
            />
            <div className="mt-8 grid gap-5">
              {agendaBenefits.map(([title, copy, Icon]) => (
                <div key={title} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sireon-cyan">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/60">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <BookingScheduler />
        </div>
      </section>

      <section id="contacto" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              tone="light"
              title="¿Prefieres explicar tu caso por mensaje?"
              description="Cuéntanos qué quieres mejorar y te responderemos con el siguiente paso más claro."
            />
            <div className="mt-8 grid gap-3">
              <a
                className="flex min-h-14 items-center gap-3 rounded-md border border-sireon-emerald/40 bg-sireon-emerald/5 px-4 text-sm font-bold text-white transition hover:border-sireon-emerald hover:bg-sireon-emerald/10"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                Enviar WhatsApp
              </a>
              <a
                className="flex min-h-14 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-sireon-cyan"
                href="#agenda"
              >
                <PhoneCall aria-hidden="true" className="h-5 w-5" />
                Agendar llamada
              </a>
              <a
                className="flex min-h-14 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-sireon-coral"
                href="#formulario-contacto"
              >
                <Mail aria-hidden="true" className="h-5 w-5" />
                Enviar correo
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionHeading
            align="center"
            tone="light"
            title="Preguntas frecuentes."
            description="Respuestas rápidas antes de reservar tu diagnóstico."
          />
          <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-white">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-sireon-cyan transition group-open:rotate-45">
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-white/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <SireonLogo textClassName="text-white" showTagline />
          </div>
          <FooterColumn
            title="Enlaces"
            items={[
              ["Servicios", "#servicios"],
              ["Proceso", "#proceso"],
              ["Agenda", "#agenda"],
              ["Casos", "#casos"],
              ["FAQ", "#faq"],
            ]}
          />
          <FooterColumn
            title="Servicios"
            items={services.map((service) => [service.title, "#servicios"] as const)}
          />
          <div>
            <p className="font-display text-sm font-bold text-white">Contacto</p>
            <div className="mt-4 grid gap-3 text-sm text-white/60">
              <a className="transition hover:text-white" href={whatsappHref}>
                WhatsApp
              </a>
              <a
                className="transition hover:text-white"
                href="#formulario-contacto"
              >
                hola@sireonsystems.com
              </a>
              <p>México, CDMX</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-xs text-white/40 sm:px-8">
          &copy; 2026 Sireon Systems. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<readonly [string, string]>;
}) {
  return (
    <div>
      <p className="font-display text-sm font-bold text-white">{title}</p>
      <div className="mt-4 grid gap-3 text-sm text-white/60">
        {items.map(([label, href]) => (
          <a key={`${label}-${href}`} className="transition hover:text-white" href={href}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function buildWhatsappHref() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "52XXXXXXXXXX";
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hola Sireon Systems, quiero revisar una oportunidad para mi negocio.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
