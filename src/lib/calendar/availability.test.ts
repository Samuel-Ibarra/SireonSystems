import { describe, expect, it } from "vitest";
import {
  createBookingRules,
  generateAvailableSlots,
  isSlotAvailable,
} from "./availability";

describe("calendar availability", () => {
  it("generates 30 minute slots inside weekday business hours", () => {
    const slots = generateAvailableSlots({
      nowIso: "2026-05-04T08:00:00-06:00",
      busy: [],
      rules: createBookingRules({ businessDaysToShow: 1 }),
    });

    expect(slots).toHaveLength(18);
    expect(slots[0]).toMatchObject({
      start: "2026-05-04T09:00:00.000-06:00",
      end: "2026-05-04T09:30:00.000-06:00",
      label: "09:00",
    });
    expect(slots.at(-1)).toMatchObject({
      start: "2026-05-04T17:30:00.000-06:00",
      end: "2026-05-04T18:00:00.000-06:00",
      label: "17:30",
    });
  });

  it("skips weekends when generating business days", () => {
    const slots = generateAvailableSlots({
      nowIso: "2026-05-01T08:00:00-06:00",
      busy: [],
      rules: createBookingRules({ businessDaysToShow: 2 }),
    });

    const dates = new Set(slots.map((slot) => slot.date));

    expect([...dates]).toEqual(["2026-05-01", "2026-05-04"]);
  });

  it("excludes slots that overlap busy blocks plus buffer", () => {
    const slots = generateAvailableSlots({
      nowIso: "2026-05-04T08:00:00-06:00",
      busy: [
        {
          start: "2026-05-04T10:00:00-06:00",
          end: "2026-05-04T10:30:00-06:00",
        },
      ],
      rules: createBookingRules({
        businessDaysToShow: 1,
        bufferMinutes: 15,
      }),
    });

    const labels = slots.map((slot) => slot.label);

    expect(labels).not.toContain("09:30");
    expect(labels).not.toContain("10:00");
    expect(labels).not.toContain("10:30");
    expect(labels).toContain("09:00");
    expect(labels).toContain("11:00");
  });

  it("rejects a selected slot outside business hours or blocked by busy time", () => {
    const rules = createBookingRules({ businessDaysToShow: 1 });

    expect(
      isSlotAvailable({
        startIso: "2026-05-04T17:30:00-06:00",
        nowIso: "2026-05-04T08:00:00-06:00",
        busy: [],
        rules,
      }),
    ).toBe(true);

    expect(
      isSlotAvailable({
        startIso: "2026-05-04T18:00:00-06:00",
        nowIso: "2026-05-04T08:00:00-06:00",
        busy: [],
        rules,
      }),
    ).toBe(false);

    expect(
      isSlotAvailable({
        startIso: "2026-05-04T10:00:00-06:00",
        nowIso: "2026-05-04T08:00:00-06:00",
        busy: [
          {
            start: "2026-05-04T10:00:00-06:00",
            end: "2026-05-04T10:30:00-06:00",
          },
        ],
        rules,
      }),
    ).toBe(false);
  });
});
