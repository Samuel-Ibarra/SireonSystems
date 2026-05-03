import "server-only";

import { randomUUID } from "node:crypto";
import { google } from "googleapis";
import { DateTime } from "luxon";

import { requiredEnv } from "@/lib/env";
import {
  type BookingRules,
  type BusyBlock,
  createBookingRules,
  getAvailabilityWindow,
} from "./availability";
import type { BookingRequestData } from "./booking";

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

type BusyBlocksInput = {
  nowIso?: string;
  rules?: BookingRules;
};

export function getGoogleOAuthClient() {
  const client = new google.auth.OAuth2(
    requiredEnv("GOOGLE_CLIENT_ID"),
    requiredEnv("GOOGLE_CLIENT_SECRET"),
    requiredEnv("GOOGLE_REDIRECT_URI"),
  );

  client.setCredentials({
    refresh_token: requiredEnv("GOOGLE_REFRESH_TOKEN"),
  });

  return client;
}

export function getGoogleSetupOAuthClient() {
  return new google.auth.OAuth2(
    requiredEnv("GOOGLE_CLIENT_ID"),
    requiredEnv("GOOGLE_CLIENT_SECRET"),
    requiredEnv("GOOGLE_REDIRECT_URI"),
  );
}

export async function getCalendarBusyBlocks({
  nowIso,
  rules = createBookingRules(),
}: BusyBlocksInput): Promise<BusyBlock[]> {
  const calendarId = requiredEnv("GOOGLE_CALENDAR_ID");
  const calendar = google.calendar({
    version: "v3",
    auth: getGoogleOAuthClient(),
  });
  const window = getAvailabilityWindow(nowIso, rules);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: window.timeMin,
      timeMax: window.timeMax,
      timeZone: window.timeZone,
      items: [{ id: calendarId }],
    },
  });

  return (
    response.data.calendars?.[calendarId]?.busy?.flatMap((block) => {
      if (!block.start || !block.end) {
        return [];
      }

      return [
        {
          start: block.start,
          end: block.end,
        },
      ];
    }) ?? []
  );
}

export async function createDiagnosticEvent(
  booking: BookingRequestData,
  rules: BookingRules = createBookingRules(),
) {
  const calendarId = requiredEnv("GOOGLE_CALENDAR_ID");
  const calendar = google.calendar({
    version: "v3",
    auth: getGoogleOAuthClient(),
  });
  const start = DateTime.fromISO(booking.start, { setZone: true }).setZone(
    rules.timeZone,
  );
  const end = start.plus({ minutes: rules.slotMinutes });
  const company = booking.company ? ` - ${booking.company}` : "";

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `Diagnóstico Sireon Systems${company}`,
      description: [
        `Prospecto: ${booking.name}`,
        `Email: ${booking.email}`,
        booking.phone ? `Telefono: ${booking.phone}` : "",
        booking.company ? `Empresa: ${booking.company}` : "",
        booking.notes ? `Notas: ${booking.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: start.toISO() ?? booking.start,
        timeZone: rules.timeZone,
      },
      end: {
        dateTime: end.toISO() ?? undefined,
        timeZone: rules.timeZone,
      },
      attendees: [
        {
          email: booking.email,
          displayName: booking.name,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return {
    id: response.data.id ?? "",
    htmlLink: response.data.htmlLink ?? "",
    meetLink: response.data.hangoutLink ?? "",
    start: start.toISO(),
    end: end.toISO(),
  };
}
