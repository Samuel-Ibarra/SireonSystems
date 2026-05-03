import { CheckCircle2, MessagesSquare, Workflow, Zap } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative min-h-[500px] w-full min-w-0 overflow-hidden rounded-[2rem] border border-sireon-mist bg-white p-5 shadow-soft">
      <div className="relative rounded-2xl border border-sireon-mist bg-sireon-ice p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold text-sireon-navy">
              Diagnóstico digital
            </p>
            <p className="text-sm text-sireon-steel">
              Presencia, procesos y automatización
            </p>
          </div>
          <span className="rounded-md bg-sireon-navy px-3 py-2 text-xs font-bold text-white">
            30 min
          </span>
        </div>

        <div className="grid gap-3">
          {[
            ["Sitio actual", "Confianza y conversión", 72],
            ["Seguimiento", "Respuesta y orden comercial", 48],
            ["Automatización", "Tareas que puede absorber IA", 64],
          ].map(([title, copy, value]) => (
            <div
              key={title}
              className="min-w-0 rounded-xl border border-sireon-mist bg-white p-4"
            >
              <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-sireon-navy">{title}</p>
                  <p className="mt-1 text-xs text-sireon-steel">{copy}</p>
                </div>
                <p className="shrink-0 font-display text-2xl font-bold text-sireon-blue">
                  {value}%
                </p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-sireon-mist">
                <div
                  className="h-2 rounded-full bg-sireon-blue"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-sireon-navy p-5 text-white">
          <Workflow aria-hidden="true" className="h-6 w-6 text-sireon-mint" />
          <p className="mt-5 text-sm font-semibold text-white/70">
            Flujo sugerido
          </p>
          <p className="mt-2 text-xl font-bold leading-tight">
            Solicitud a propuesta sin perder seguimiento.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            [MessagesSquare, "Responder preguntas frecuentes"],
            [Zap, "Automatizar tareas repetidas"],
            [CheckCircle2, "Medir oportunidades reales"],
          ].map(([Icon, label]) => (
            <div
              key={label as string}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-sireon-mist bg-white px-4 py-3 text-sm font-semibold text-sireon-navy"
            >
              <Icon aria-hidden="true" className="h-5 w-5 text-sireon-blue" />
              <span className="min-w-0">{label as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
