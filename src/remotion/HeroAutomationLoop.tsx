import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { colors, durationInFrames, easeOut, fontStack } from "./theme";

type AutomationNode = {
  label: string;
  meta: string;
  x: number;
  y: number;
  color: string;
  side: "left" | "right";
};

const nodes: AutomationNode[] = [
  {
    label: "Sitio web",
    meta: "Confianza",
    x: 96,
    y: 134,
    color: colors.cyan,
    side: "left",
  },
  {
    label: "Formularios",
    meta: "Captura",
    x: 86,
    y: 230,
    color: colors.emerald,
    side: "left",
  },
  {
    label: "WhatsApp",
    meta: "Atención",
    x: 102,
    y: 326,
    color: colors.magenta,
    side: "left",
  },
  {
    label: "Integraciones",
    meta: "Operaciones",
    x: 92,
    y: 422,
    color: colors.blue,
    side: "left",
  },
  {
    label: "Respuestas 24/7",
    meta: "Soporte",
    x: 690,
    y: 142,
    color: colors.emerald,
    side: "right",
  },
  {
    label: "Seguimiento",
    meta: "Ventas",
    x: 714,
    y: 248,
    color: colors.blue,
    side: "right",
  },
  {
    label: "Tareas",
    meta: "Equipo",
    x: 704,
    y: 354,
    color: colors.cyan,
    side: "right",
  },
  {
    label: "Reportes",
    meta: "Dirección",
    x: 680,
    y: 460,
    color: colors.coral,
    side: "right",
  },
];

const center = { x: 480, y: 332 };

export const HeroAutomationLoop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loopFrame = frame % durationInFrames;
  const seconds = frame / fps;
  const entry = interpolate(loopFrame, [0, 1.4 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.55 + 0.45 * Math.sin(seconds * Math.PI * 2 * 0.72);
  const rotate = Math.sin(seconds * Math.PI * 2 * 0.22) * 3;
  const flow = ((frame % 60) / 60) * 32;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #020511 0%, #06101F 34%, #08142C 58%, #17051A 80%, #2A0719 100%)",
        color: colors.text,
        fontFamily: fontStack,
        overflow: "hidden",
      }}
    >
      <div style={scanGridStyle} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 80%, rgba(0,229,255,0.22), transparent 28%), radial-gradient(circle at 92% 74%, rgba(255,62,165,0.18), transparent 34%), linear-gradient(90deg, rgba(0,229,255,0.08), transparent 45%, rgba(255,122,61,0.1))",
        }}
      />

      <svg
        width="960"
        height="720"
        viewBox="0 0 960 720"
        style={{ position: "absolute", inset: 0, opacity: 0.98 }}
      >
        <defs>
          <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={colors.cyan} />
            <stop offset="55%" stopColor={colors.emerald} />
            <stop offset="100%" stopColor={colors.magenta} />
          </linearGradient>
          <linearGradient id="hero-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.cyan} />
            <stop offset="45%" stopColor={colors.emerald} />
            <stop offset="100%" stopColor={colors.coral} />
          </linearGradient>
        </defs>

        <ellipse
          cx="480"
          cy="575"
          rx={170 + pulse * 18}
          ry={38 + pulse * 5}
          fill="none"
          stroke="url(#hero-ring)"
          strokeWidth="2"
          opacity={0.55}
        />
        <ellipse
          cx="480"
          cy="575"
          rx={105 + pulse * 8}
          ry={24 + pulse * 4}
          fill="none"
          stroke={colors.cyan}
          strokeWidth="3"
          opacity={0.5 + pulse * 0.35}
        />

        {nodes.map((node, index) => {
          const pathOpacity = interpolate(
            loopFrame,
            [index * 6, index * 6 + 22],
            [0.2, 1],
            {
              easing: easeOut,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          const startX = node.side === "left" ? node.x + 196 : node.x - 8;
          const startY = node.y + 33;
          const controlA = node.side === "left" ? center.x - 120 : center.x + 120;
          const controlB = node.side === "left" ? startX + 92 : startX - 92;
          const d = `M ${center.x} ${center.y} C ${controlA} ${center.y}, ${controlB} ${startY}, ${startX} ${startY}`;

          return (
            <path
              key={node.label}
              d={d}
              fill="none"
              stroke={node.color}
              strokeDasharray="12 18"
              strokeDashoffset={-flow}
              strokeLinecap="round"
              strokeWidth="3"
              opacity={pathOpacity * 0.8}
            />
          );
        })}

        {Array.from({ length: 23 }).map((_, index) => {
          const x = 352 + index * 12;
          const delay = index * 0.15;
          const ray = 0.35 + 0.65 * Math.sin(seconds * 3.2 + delay);
          return (
            <line
              key={x}
              x1={x}
              x2={x + Math.sin(index) * 10}
              y1="408"
              y2="560"
              stroke={index % 3 === 0 ? colors.magenta : colors.cyan}
              strokeDasharray="4 12"
              strokeLinecap="round"
              strokeWidth="2"
              opacity={ray * 0.42}
            />
          );
        })}
      </svg>

      <div
        style={{
          ...panelShellStyle,
          left: 280,
          top: 94,
          width: 400,
          height: 462,
          opacity: 0.48,
          transform: `rotate(${rotate}deg) scale(${0.94 + entry * 0.06})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: center.x - 84,
          top: center.y - 94,
          width: 168,
          height: 168,
          clipPath: "polygon(50% 0%, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%)",
          background:
            "linear-gradient(135deg, rgba(0,229,255,0.9), rgba(25,246,177,0.9) 48%, rgba(139,92,246,0.9))",
          boxShadow: `0 0 ${44 + pulse * 22}px rgba(0,229,255,0.46), inset 0 0 32px rgba(255,255,255,0.22)`,
          transform: `scale(${0.88 + entry * 0.12})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 16,
            clipPath:
              "polygon(50% 0%, 91% 25%, 91% 75%, 50% 100%, 9% 75%, 9% 25%)",
            background: "linear-gradient(180deg, #0B1B33, #0E2A45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 50,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            IA
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 0,
              color: colors.emerald,
            }}
          >
            AUTOMATIZA
          </div>
        </div>
      </div>

      {nodes.map((node, index) => {
        const reveal = interpolate(loopFrame, [index * 6, index * 6 + 20], [0, 1], {
          easing: easeOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nodePulse = 0.45 + 0.55 * Math.sin(seconds * 2.2 + index);
        const direction = node.side === "left" ? -18 : 18;

        return (
          <div
            key={node.label}
            style={{
              ...nodeStyle,
              left: node.x,
              top: node.y,
              borderColor: `rgba(${hexToRgb(node.color)}, ${0.28 + nodePulse * 0.22})`,
              boxShadow: `0 0 ${12 + nodePulse * 18}px rgba(${hexToRgb(
                node.color,
              )}, 0.2)`,
              opacity: reveal,
              transform: `translateX(${direction * (1 - reveal)}px)`,
            }}
          >
            <span
              style={{
                ...nodeDotStyle,
                background: node.color,
                boxShadow: `0 0 20px ${node.color}`,
              }}
            />
            <span style={{ minWidth: 0 }}>
              <span style={nodeTitleStyle}>{node.label}</span>
              <span style={nodeMetaStyle}>{node.meta}</span>
            </span>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 54,
          bottom: 50,
          width: 852,
          height: 72,
          borderRadius: 22,
          border: "1px solid rgba(125, 211, 252, 0.16)",
          background: "rgba(3, 7, 18, 0.54)",
          boxShadow:
            "0 0 40px rgba(0,229,255,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {["Solicitud", "Respuesta", "Seguimiento", "Reporte"].map((label, index) => (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 40 + index * 210,
              top: 18,
              width: 170,
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: colors.text,
              opacity: 0.76 + 0.24 * Math.sin(seconds * 2 + index),
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background:
                  index % 2 === 0 ? colors.emerald : index === 1 ? colors.cyan : colors.coral,
                boxShadow: "0 0 18px currentColor",
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 800 }}>{label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const scanGridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
};

const panelShellStyle: CSSProperties = {
  position: "absolute",
  borderRadius: 34,
  border: "1px solid rgba(125,211,252,0.24)",
  background:
    "linear-gradient(135deg, rgba(7,19,36,0.9), rgba(11,26,50,0.35))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 34px 90px rgba(0,0,0,0.34)",
};

const nodeStyle: CSSProperties = {
  position: "absolute",
  width: 188,
  minHeight: 66,
  display: "flex",
  alignItems: "center",
  gap: 14,
  borderRadius: 18,
  border: "1px solid rgba(125,211,252,0.22)",
  background: colors.panelStrong,
  padding: "12px 14px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const nodeDotStyle: CSSProperties = {
  width: 16,
  height: 16,
  flex: "0 0 auto",
  borderRadius: 999,
};

const nodeTitleStyle: CSSProperties = {
  display: "block",
  color: colors.text,
  fontSize: 19,
  fontWeight: 800,
  lineHeight: 1.05,
};

const nodeMetaStyle: CSSProperties = {
  display: "block",
  marginTop: 5,
  color: colors.muted,
  fontSize: 13,
  fontWeight: 600,
};

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
