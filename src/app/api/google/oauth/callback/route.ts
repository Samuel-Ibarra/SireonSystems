import { NextRequest, NextResponse } from "next/server";

import { getGoogleSetupOAuthClient } from "@/lib/calendar/google";
import { MissingEnvError, requiredEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const setupToken = requiredEnv("GOOGLE_OAUTH_SETUP_TOKEN");
    const state = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");

    if (state !== setupToken) {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    if (!code) {
      return NextResponse.json(
        { message: "Google no regreso un codigo OAuth." },
        { status: 400 },
      );
    }

    const client = getGoogleSetupOAuthClient();
    const { tokens } = await client.getToken(code);

    return NextResponse.json({
      message:
        "Copia GOOGLE_REFRESH_TOKEN a tus variables de entorno y elimina este valor del historial compartido.",
      refreshToken: tokens.refresh_token ?? null,
      hasAccessToken: Boolean(tokens.access_token),
    });
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
      { message: "No fue posible completar OAuth." },
      { status: 500 },
    );
  }
}
