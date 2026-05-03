import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./booking";

describe("bookingRequestSchema", () => {
  it("accepts a valid diagnostic booking request", () => {
    const result = bookingRequestSchema.safeParse({
      start: "2026-05-04T09:00:00.000-06:00",
      name: "Carlos Medina",
      email: "carlos@example.com",
      company: "Comercial Delta",
      phone: "+52 81 1234 5678",
      notes: "Queremos automatizar seguimiento de leads.",
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid booking requests and honeypot submissions", () => {
    const result = bookingRequestSchema.safeParse({
      start: "not-a-date",
      name: "C",
      email: "invalid",
      company: "",
      phone: "",
      notes: "",
      website: "spam.example",
    });

    expect(result.success).toBe(false);
  });
});
