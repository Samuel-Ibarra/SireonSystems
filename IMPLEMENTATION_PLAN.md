# Sireon Systems Landing Page - Implementation Plan

## Objective

Build a Next.js landing page for Sireon Systems inside this folder, focused on PyMEs en crecimiento. The site must promote web development, landing pages, AI automations, chatbots, and integrations through a premium "IA viva" visual style inspired by the approved concept image:

`C:\Users\sjib_\.codex\generated_images\019de2d8-fd56-73e1-b41a-d754518d1c88\ig_02fd8d8bc7b31b020169f48255d514819096e0d45ba7e4e616.png`

Primary conversion paths:

- Book a diagnostic call through a custom Google Calendar API flow.
- Start a WhatsApp conversation.
- Submit a contact form that sends email through Resend.

## Product Direction

- Audience: growing small and medium businesses that need better digital presence, clearer processes, and less manual work.
- Positioning: practical technology for real business outcomes, not AI for show.
- Commercial strategy: diagnostic-first, no public prices in v1.
- Tone: clear, professional, consultative, confident.
- Visual system: premium dark interface with deep navy/black, dark magenta and subtle coral transitions, luminous automation diagrams, translucent panels, crisp typography, and energetic cyan, emerald, magenta, coral, violet, and blue accents. Brand colors are allowed to evolve beyond the original pack when the result feels more alive and commercially stronger.

Current visual tokens:

- Ink: `#030712`
- Midnight: `#071324`
- Deep blue: `#0B1F3A`
- Electric blue: `#2F80FF`
- Cyan: `#00E5FF`
- Emerald: `#19F6B1`
- Magenta: `#FF3EA5`
- Coral: `#FF7A3D`
- Violet: `#8B5CF6`
- Typography direction: Manrope for body/UI and Sora for display headings.

## Technical Architecture

- Framework: Next.js App Router with TypeScript.
- Runtime: Next.js 16 with a local Node 22 dev dependency for scripts; deployment should use Node 20.9+.
- Styling: Tailwind CSS with reusable design tokens and focused components.
- Frontend standards:
  - Mobile-first responsive layout.
  - Semantic HTML and accessible form controls.
  - Stable component dimensions to avoid layout shift.
  - Clear focus, hover, loading, success, and error states.
  - No exposed secrets in client code.
  - Client components only where interactivity is required.
- Analytics: Vercel Analytics.

## Remotion Animation System

Remotion is used for embedded, muted, looping video assets only in this iteration.

Dependencies:

- `remotion`
- `@remotion/cli`

Compositions:

- `HeroAutomationLoop`: IA node connecting sitio web, formularios, WhatsApp, integraciones, respuestas 24/7, seguimiento, tareas, and reportes.
- `ServicesOrbitLoop`: services orbiting around the Sireon mark to reinforce a connected operating system.

Source:

- `src/remotion/index.tsx`
- `src/remotion/Root.tsx`
- `src/remotion/HeroAutomationLoop.tsx`
- `src/remotion/ServicesOrbitLoop.tsx`

Rendered assets:

- `public/animations/hero-automation.mp4`
- `public/animations/hero-automation-poster.png`
- `public/animations/services-orbit.mp4`
- `public/animations/services-orbit-poster.png`

Frontend integration:

- Use `<video autoPlay muted loop playsInline>` through the `AnimatedVideo` component.
- Provide poster image fallback for `prefers-reduced-motion`.
- Keep important copy in HTML, not inside the video.

## Page Structure

Recommended sections:

1. Premium hero with offer, Calendar CTA, WhatsApp CTA, trust signals, and Remotion automation loop.
2. Business pain and solution framing for manual processes.
3. Services section with Remotion orbit loop and connected service narrative.
4. Process: diagnose, strategy/proposal, implementation, support.
5. Case/proof framing to guide prospects toward booking or contact.
6. Calendar booking module with available slots.
7. Contact form and alternate WhatsApp/email paths.
8. FAQ using content from the branding pack.
9. Premium footer with links, services, and contact.

## Google Calendar API Integration

Auth model:

- OAuth owner account.
- The visitor does not sign in with Google.
- The backend uses stored OAuth credentials from environment variables.

API routes:

- `GET /api/calendar/availability`
  - Uses Google Calendar `freeBusy`.
  - Returns available slots.
- `POST /api/calendar/book`
  - Validates request data.
  - Re-checks availability before booking.
  - Creates a calendar event.
  - Adds Google Meet details.
  - Sends invitation updates to the attendee.

Booking rules:

- Duration: 30 minutes.
- Days: Monday to Friday.
- Working hours: 09:00 to 18:00.
- Time zone: `America/Mexico_City`.
- Buffer: 15 minutes.
- Visible window: next 14 business days.

## Contact And Messaging Integrations

Resend:

- Server-side email sending only.
- API key stored in `.env`.
- Use the Resend REST API from the Next.js backend instead of exposing a client-side key.
- Contact form fields:
  - Name
  - Email
  - Phone
  - Company
  - Service interest
  - Message
  - Honeypot anti-spam field

WhatsApp:

- Uses public environment variables for number and initial message.
- Link is generated client-side from safe public values.

## Environment Variables

Public:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_WHATSAPP_MESSAGE`

Server-only:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_OAUTH_SETUP_TOKEN`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The repository should include `.env.example` with placeholders only. Real values stay in `.env.local` or deployment environment variables.

## Testing And Verification

Required checks:

- Unit tests for calendar slot generation, validation, and booking guards.
- Unit tests for contact form validation.
- `npm run lint`
- `npm run build`
- `npm run remotion:compositions`
- `npm run remotion:render`
- Manual responsive review on desktop and mobile.
- Visual QA must compare against the approved concept image and confirm no horizontal overflow.
- Verify Calendar flow:
  - Available slots exclude busy times.
  - Booking revalidates before event creation.
  - Event includes Google Meet and attendee invite.
  - Calendar API errors show useful user-facing messages.
- Verify Resend flow:
  - Valid contact sends email.
  - Invalid fields show errors.
  - Missing env/config is handled server-side without exposing secrets.

## Decisions Locked

- Use Google Calendar API, not just a booking link.
- Use OAuth owner credentials, not service account, for v1.
- Use Resend for email.
- Use Vercel Analytics.
- Do not show public pricing in v1.
- Do not show unverifiable numeric proof metrics in v1. Keep qualitative credibility signals only unless the business has confirmed figures.
- Keep the first version focused: no payments, no CRM, no admin dashboard.

## References

- Google Calendar API auth: https://developers.google.com/workspace/calendar/api/auth
- Google OAuth server-side apps: https://developers.google.com/identity/protocols/oauth2/web-server
- Google Calendar FreeBusy: https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
- Google Calendar Events insert: https://developers.google.com/workspace/calendar/api/v3/reference/events/insert
- Resend docs: https://resend.com/docs
- Next.js docs: https://nextjs.org/docs
