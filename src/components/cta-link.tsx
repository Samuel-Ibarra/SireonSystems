import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CtaLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "bg-[linear-gradient(135deg,#FF3EA5_0%,#FF7A3D_100%)] text-white shadow-[0_18px_45px_rgba(255,62,165,0.24)] hover:-translate-y-0.5 hover:shadow-[0_22px_58px_rgba(255,122,61,0.28)]",
  secondary:
    "border border-sireon-emerald/50 bg-sireon-emerald/5 text-white shadow-[0_0_24px_rgba(25,246,177,0.08)] hover:-translate-y-0.5 hover:border-sireon-emerald hover:bg-sireon-emerald/10",
  ghost: "text-white/70 hover:text-white",
};

export function CtaLink({
  className,
  children,
  variant = "primary",
  ...props
}: CtaLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sireon-cyan focus:ring-offset-2 focus:ring-offset-sireon-ink",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
