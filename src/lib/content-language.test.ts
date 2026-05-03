import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const visibleTextFiles = [
  "src/app/page.tsx",
  "src/components/booking-scheduler.tsx",
  "src/components/hero-visual.tsx",
  "src/lib/site-content.ts",
  "src/lib/contact/email-templates.ts",
  "src/lib/calendar/google.ts",
  "src/remotion/HeroAutomationLoop.tsx",
];

describe("Spanish commercial language", () => {
  it("does not use English lead wording in visible content", () => {
    const matches = visibleTextFiles.flatMap((file) => {
      const content = readFileSync(join(process.cwd(), file), "utf8");
      return [...content.matchAll(/\bleads?\b/gi)].map(
        (match) => `${file}: ${match[0]}`,
      );
    });

    expect(matches).toEqual([]);
  });

  it("does not keep real secrets in env example", () => {
    const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf8");

    expect(envExample).not.toContain("GOCSPX-");
    expect(envExample).not.toContain("re_");
    expect(envExample).toContain("SUPABASE_URL=");
    expect(envExample).toContain("WHATSAPP_VERIFY_TOKEN=");
  });
});
