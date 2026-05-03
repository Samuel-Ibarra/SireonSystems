import { DateTime, Interval } from "luxon";

export type BusyBlock = {
  start: string;
  end: string;
};

export type BookingRules = {
  timeZone: string;
  businessDaysToShow: number;
  workdayStartHour: number;
  workdayEndHour: number;
  slotMinutes: number;
  bufferMinutes: number;
};

export type AvailabilitySlot = {
  start: string;
  end: string;
  date: string;
  label: string;
};

const DEFAULT_RULES: BookingRules = {
  timeZone: "America/Mexico_City",
  businessDaysToShow: 14,
  workdayStartHour: 9,
  workdayEndHour: 18,
  slotMinutes: 30,
  bufferMinutes: 15,
};

type GenerateSlotsInput = {
  nowIso?: string;
  busy: BusyBlock[];
  rules?: BookingRules;
};

type SlotAvailabilityInput = {
  startIso: string;
  nowIso?: string;
  busy: BusyBlock[];
  rules?: BookingRules;
};

export function createBookingRules(
  overrides: Partial<BookingRules> = {},
): BookingRules {
  return {
    ...DEFAULT_RULES,
    ...overrides,
  };
}

export function generateAvailableSlots({
  nowIso,
  busy,
  rules = DEFAULT_RULES,
}: GenerateSlotsInput): AvailabilitySlot[] {
  const normalizedRules = createBookingRules(rules);
  const now = parseDate(nowIso, normalizedRules.timeZone);
  const businessDays = getBusinessDays(now, normalizedRules);

  return businessDays.flatMap((day) =>
    generateSlotsForDay(day, now, busy, normalizedRules),
  );
}

export function isSlotAvailable({
  startIso,
  nowIso,
  busy,
  rules = DEFAULT_RULES,
}: SlotAvailabilityInput): boolean {
  const normalizedRules = createBookingRules(rules);
  const now = parseDate(nowIso, normalizedRules.timeZone);
  const start = DateTime.fromISO(startIso, {
    setZone: true,
  }).setZone(normalizedRules.timeZone);

  if (!start.isValid || !isBusinessDay(start)) {
    return false;
  }

  const end = start.plus({ minutes: normalizedRules.slotMinutes });
  const workdayStart = start.set({
    hour: normalizedRules.workdayStartHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const workdayEnd = start.set({
    hour: normalizedRules.workdayEndHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  if (start < now.plus({ minutes: normalizedRules.bufferMinutes })) {
    return false;
  }

  if (start < workdayStart || end > workdayEnd) {
    return false;
  }

  return !slotOverlapsBusyTime(start, end, busy, normalizedRules);
}

export function getAvailabilityWindow(
  nowIso?: string,
  rules: BookingRules = DEFAULT_RULES,
) {
  const normalizedRules = createBookingRules(rules);
  const now = parseDate(nowIso, normalizedRules.timeZone);
  const businessDays = getBusinessDays(now, normalizedRules);
  const firstDay = businessDays[0] ?? now;
  const lastDay = businessDays.at(-1) ?? now;

  return {
    timeMin: firstDay.startOf("day").toUTC().toISO(),
    timeMax: lastDay.endOf("day").toUTC().toISO(),
    timeZone: normalizedRules.timeZone,
  };
}

function generateSlotsForDay(
  day: DateTime,
  now: DateTime,
  busy: BusyBlock[],
  rules: BookingRules,
): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  let cursor = day.set({
    hour: rules.workdayStartHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const workdayEnd = day.set({
    hour: rules.workdayEndHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  while (cursor.plus({ minutes: rules.slotMinutes }) <= workdayEnd) {
    const end = cursor.plus({ minutes: rules.slotMinutes });
    const startIso = cursor.toISO();

    if (
      startIso &&
      cursor >= now.plus({ minutes: rules.bufferMinutes }) &&
      !slotOverlapsBusyTime(cursor, end, busy, rules)
    ) {
      slots.push({
        start: startIso,
        end: end.toISO() ?? "",
        date: cursor.toISODate() ?? "",
        label: cursor.toFormat("HH:mm"),
      });
    }

    cursor = cursor.plus({ minutes: rules.slotMinutes });
  }

  return slots;
}

function getBusinessDays(now: DateTime, rules: BookingRules): DateTime[] {
  const days: DateTime[] = [];
  let cursor = now.startOf("day");

  while (days.length < rules.businessDaysToShow) {
    if (isBusinessDay(cursor)) {
      days.push(cursor);
    }

    cursor = cursor.plus({ days: 1 });
  }

  return days;
}

function isBusinessDay(date: DateTime): boolean {
  return date.weekday >= 1 && date.weekday <= 5;
}

function slotOverlapsBusyTime(
  start: DateTime,
  end: DateTime,
  busy: BusyBlock[],
  rules: BookingRules,
): boolean {
  const slot = Interval.fromDateTimes(start, end);

  return busy.some((block) => {
    const busyStart = DateTime.fromISO(block.start, { setZone: true })
      .setZone(rules.timeZone)
      .minus({ minutes: rules.bufferMinutes });
    const busyEnd = DateTime.fromISO(block.end, { setZone: true })
      .setZone(rules.timeZone)
      .plus({ minutes: rules.bufferMinutes });

    if (!busyStart.isValid || !busyEnd.isValid) {
      return false;
    }

    const blocked = Interval.fromDateTimes(busyStart, busyEnd);
    return slot.overlaps(blocked);
  });
}

function parseDate(value: string | undefined, timeZone: string): DateTime {
  if (!value) {
    return DateTime.now().setZone(timeZone);
  }

  return DateTime.fromISO(value, { setZone: true }).setZone(timeZone);
}
