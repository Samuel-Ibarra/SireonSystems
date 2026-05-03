import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sireonsystems.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sireon Systems | Sitios web, IA y automatización",
    template: "%s | Sireon Systems",
  },
  description:
    "Desarrollo web, automatización e integraciones con IA para PyMEs que buscan operar mejor y vender con mayor confianza.",
  openGraph: {
    title: "Sireon Systems",
    description:
      "Sitios web, landing pages, automatizaciones con IA, chatbots e integraciones para negocios reales.",
    url: siteUrl,
    siteName: "Sireon Systems",
    locale: "es_MX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${manrope.variable} ${sora.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
