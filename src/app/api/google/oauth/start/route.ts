import { NextRequest, NextResponse } from "next/server";

import {
  GOOGLE_CALENDAR_SCOPES,
  getGoogleSetupOAuthClient,
} from "@/lib/calendar/google";
import { MissingEnvError, requiredEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const setupToken = requiredEnv("GOOGLE_OAUTH_SETUP_TOKEN");
    const providedToken = request.nextUrl.searchParams.get("setupToken");

    if (providedToken !== setupToken) {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    const client = getGoogleSetupOAuthClient();
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_CALENDAR_SCOPES,
      state: setupToken,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return NextResponse.json(
        {
          message:
            "Configura GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI y GOOGLE_OAUTH_SETUP_TOKEN.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "No fue posible iniciar OAuth." },
      { status: 500 },
    );
  }
}
