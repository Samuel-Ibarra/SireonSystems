import { NextResponse } from "next/server";

import {
  createBookingRules,
  generateAvailableSlots,
} from "@/lib/calendar/availability";
import { getCalendarBusyBlocks } from "@/lib/calendar/google";
import { MissingEnvError } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rules = createBookingRules();
    const busy = await getCalendarBusyBlocks({ rules });
    const slots = generateAvailableSlots({ busy, rules });

    return NextResponse.json({
      slots,
      timeZone: rules.timeZone,
    });
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return NextResponse.json(
        {
          message:
            "La agenda aun no esta configurada. Revisa las variables de Google Calendar.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message:
          "No pudimos cargar disponibilidad en este momento. Inténtalo más tarde.",
      },
      { status: 500 },
    );
  }
}
