import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "dark" | "light";
};

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
  tone = "dark",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "font-display text-3xl font-bold leading-tight sm:text-4xl",
          tone === "light" ? "text-white" : "text-sireon-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7 sm:text-lg",
            tone === "light" ? "text-white/70" : "text-sireon-steel",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
