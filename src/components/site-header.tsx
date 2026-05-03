import { ArrowRight, CalendarCheck, MessageCircle } from "lucide-react";

import { navItems } from "@/lib/site-content";
import { CtaLink } from "./cta-link";
import { SireonLogo } from "./sireon-logo";

type SiteHeaderProps = {
  whatsappHref: string;
};

export function SiteHeader({ whatsappHref }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-sireon-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a className="min-w-0" href="#inicio" aria-label="Ir al inicio">
          <SireonLogo className="min-w-0" textClassName="min-w-0 text-white" />
        </a>
        <nav
          className="hidden items-center gap-8 text-sm font-bold text-white/70 lg:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              className="transition hover:text-white"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CtaLink className="hidden lg:inline-flex" href="#agenda">
            Agendar diagnóstico
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </CtaLink>
          <CtaLink
            className="hidden lg:inline-flex"
            href={whatsappHref}
            target="_blank"
            variant="secondary"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
          </CtaLink>
          <CtaLink
            aria-label="Agendar diagnóstico"
            className="h-11 w-11 shrink-0 px-0 lg:hidden"
            href="#agenda"
          >
            <CalendarCheck aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Agendar diagnóstico</span>
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
