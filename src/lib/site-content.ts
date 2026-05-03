import {
  Bot,
  CalendarCheck,
  Globe2,
  Layers3,
  MessagesSquare,
  Network,
  Sparkles,
  Zap,
} from "lucide-react";

export const navItems = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Agenda", href: "#agenda" },
  { label: "Casos", href: "#casos" },
  { label: "FAQ", href: "#faq" },
];

export const services = [
  {
    title: "Sitios web que venden",
    description:
      "Diseño moderno, mensajes claros y rutas de conversión para transformar visitantes en conversaciones.",
    icon: Globe2,
  },
  {
    title: "Automatizaciones con IA",
    description:
      "Flujos que eliminan tareas repetitivas y conectan información entre tus canales clave.",
    icon: Sparkles,
  },
  {
    title: "Chatbots inteligentes",
    description:
      "Atención 24/7, preguntas frecuentes, calificación de prospectos y seguimiento sin fricción.",
    icon: Bot,
  },
  {
    title: "Integraciones a tu medida",
    description:
      "Conectamos formularios, WhatsApp, CRM, correo, agenda y reportes para operar en automático.",
    icon: Layers3,
  },
];

export const painPoints = [
  "Solicitudes que llegan por varios canales y nadie centraliza.",
  "Cotizaciones, seguimientos y respuestas repetidas manualmente.",
  "Sitios que se ven bien, pero no explican ni venden con claridad.",
];

export const processSteps = [
  {
    title: "Diagnóstico",
    description:
      "Revisamos tu presencia digital, procesos actuales y oportunidades de automatización.",
    icon: CalendarCheck,
  },
  {
    title: "Propuesta clara",
    description:
      "Definimos alcance, prioridades, tiempos y entregables sin lenguaje innecesariamente técnico.",
    icon: MessagesSquare,
  },
  {
    title: "Implementación",
    description:
      "Construimos el sitio, flujo o integración con buenas prácticas y pruebas de funcionamiento.",
    icon: Zap,
  },
  {
    title: "Acompañamiento",
    description:
      "Cerramos con accesos, documentación básica y recomendaciones de operación.",
    icon: Network,
  },
];

export const faqs = [
  {
    question: "¿Qué hace Sireon Systems?",
    answer:
      "Creamos sitios web, landing pages, automatizaciones con IA, chatbots e integraciones para negocios que quieren mejorar su presencia digital y operación.",
  },
  {
    question: "¿Trabajan solo con empresas grandes?",
    answer:
      "No. Trabajamos principalmente con PyMEs, profesionales, despachos y negocios en crecimiento.",
  },
  {
    question: "¿Qué necesito para empezar?",
    answer:
      "Necesitamos entender tu negocio, tus objetivos, tus procesos actuales y las herramientas que usas.",
  },
  {
    question: "¿Pueden automatizar WhatsApp?",
    answer:
      "Sí, se puede analizar el caso. La solución depende del flujo, volumen, herramientas actuales y restricciones de cada plataforma.",
  },
  {
    question: "¿Hacen chatbots con IA?",
    answer:
      "Sí. Diseñamos chatbots orientados a atención, calificación de prospectos, preguntas frecuentes y soporte operativo.",
  },
  {
    question: "¿Ofrecen mantenimiento?",
    answer:
      "Sí. Puede ofrecerse soporte mensual para ajustes, monitoreo, mejoras y nuevas automatizaciones.",
  },
];

export const serviceInterestOptions = [
  "Sitio web corporativo",
  "Landing page",
  "Automatizaciones con IA",
  "Chatbots e integraciones",
  "Diagnóstico general",
];
