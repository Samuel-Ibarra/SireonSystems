import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { colors, durationInFrames, easeOut, fontStack } from "./theme";

type OrbitService = {
  label: string;
  copy: string;
  color: string;
  angle: number;
};

const services: OrbitService[] = [
  {
    label: "Sitios web",
    copy: "Venden mejor",
    color: colors.cyan,
    angle: -0.55,
  },
  {
    label: "IA",
    copy: "Automatiza",
    color: colors.emerald,
    angle: 0.85,
  },
  {
    label: "Chatbots",
    copy: "Atienden 24/7",
    color: colors.magenta,
    angle: 2.1,
  },
  {
    label: "Integraciones",
    copy: "Conectan todo",
    color: colors.coral,
    angle: 3.55,
  },
];

const center = { x: 480, y: 360 };

export const ServicesOrbitLoop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loopFrame = frame % durationInFrames;
  const seconds = frame / fps;
  const entry = interpolate(loopFrame, [0, 1.3 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const orbit = seconds * 0.34;
  const ringPulse = 0.5 + 0.5 * Math.sin(seconds * Math.PI * 2 * 0.45);

  const positions = services.map((service, index) => {
    const angle = service.angle + orbit;
    const x = center.x + Math.cos(angle) * 268;
    const y = center.y + Math.sin(angle) * 198;
    const depth = (Math.sin(angle) + 1) / 2;
    const reveal = interpolate(loopFrame, [index * 8, index * 8 + 22], [0, 1], {
      easing: easeOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { ...service, angle, x, y, depth, reveal };
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #020511 0%, #061626 36%, #0C0927 66%, #1A0619 100%)",
        color: colors.text,
        fontFamily: fontStack,
        overflow: "hidden",
      }}
    >
      <div style={gridStyle} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 28% 44%, rgba(0,229,255,0.16), transparent 32%), radial-gradient(circle at 88% 76%, rgba(255,62,165,0.16), transparent 34%), linear-gradient(115deg, rgba(0,229,255,0.08), transparent 40%, rgba(255,122,61,0.12))",
        }}
      />

      <svg
        width="960"
        height="720"
        viewBox="0 0 960 720"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="service-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.cyan} />
            <stop offset="50%" stopColor={colors.violet} />
            <stop offset="100%" stopColor={colors.coral} />
          </linearGradient>
        </defs>
        <ellipse
          cx={center.x}
          cy={center.y}
          rx={252 + ringPulse * 8}
          ry={188 + ringPulse * 6}
          fill="none"
          stroke="url(#service-ring)"
          strokeDasharray="8 18"
          strokeDashoffset={-(frame % 90)}
          strokeLinecap="round"
          strokeWidth="3"
          opacity={0.72}
          transform={`rotate(${-12 + Math.sin(seconds) * 2} ${center.x} ${center.y})`}
        />
        <ellipse
          cx={center.x}
          cy={center.y}
          rx="178"
          ry="132"
          fill="none"
          stroke={colors.cyan}
          strokeDasharray="4 14"
          strokeDashoffset={frame % 70}
          strokeLinecap="round"
          strokeWidth="2"
          opacity={0.32}
          transform={`rotate(${18 + Math.cos(seconds) * 3} ${center.x} ${center.y})`}
        />
        {positions.map((service) => (
          <line
            key={service.label}
            x1={center.x}
            y1={center.y}
            x2={service.x}
            y2={service.y}
            stroke={service.color}
            strokeDasharray="6 14"
            strokeLinecap="round"
            strokeWidth="2.5"
            opacity={(0.18 + service.depth * 0.32) * service.reveal}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: center.x - 128,
          top: center.y - 128,
          width: 256,
          height: 256,
          borderRadius: 999,
          border: "1px solid rgba(125,211,252,0.18)",
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,229,255,0.24), transparent 55%), rgba(3,7,18,0.8)",
          boxShadow: `0 0 ${54 + ringPulse * 24}px rgba(139,92,246,0.26), inset 0 0 42px rgba(0,229,255,0.12)`,
          transform: `scale(${0.9 + entry * 0.1})`,
        }}
      >
        <div style={emblemStyle}>
          <div
            style={{
              fontSize: 168,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 0,
              background:
                "linear-gradient(135deg, #00E5FF, #19F6B1 44%, #8B5CF6 72%, #FF7A3D)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 32px rgba(0,229,255,0.25)",
            }}
          >
            S
          </div>
        </div>
      </div>

      {positions.map((service, index) => {
        const width = service.label === "Integraciones" ? 238 : 210;
        return (
          <div
            key={service.label}
            style={{
              ...serviceNodeStyle,
              left: service.x - width / 2,
              top: service.y - 44,
              width,
              borderColor: `rgba(${hexToRgb(service.color)}, ${0.25 + service.depth * 0.38})`,
              boxShadow: `0 0 ${18 + service.depth * 24}px rgba(${hexToRgb(
                service.color,
              )}, 0.18)`,
              opacity: service.reveal * (0.72 + service.depth * 0.28),
              transform: `scale(${0.9 + service.depth * 0.14})`,
              zIndex: 10 + Math.round(service.depth * 10),
            }}
          >
            <span
              style={{
                ...serviceIconStyle,
                background: service.color,
                boxShadow: `0 0 20px ${service.color}`,
              }}
            >
              {index + 1}
            </span>
            <span>
              <span style={serviceLabelStyle}>{service.label}</span>
              <span style={serviceCopyStyle}>{service.copy}</span>
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const gridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(125,211,252,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.05) 1px, transparent 1px)",
  backgroundSize: "46px 46px",
  maskImage: "linear-gradient(90deg, rgba(0,0,0,0.85), rgba(0,0,0,0.28))",
};

const emblemStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const serviceNodeStyle: CSSProperties = {
  position: "absolute",
  minHeight: 82,
  display: "flex",
  alignItems: "center",
  gap: 14,
  borderRadius: 22,
  border: "1px solid rgba(125,211,252,0.22)",
  background: "rgba(7,19,36,0.88)",
  padding: "13px 15px",
};

const serviceIconStyle: CSSProperties = {
  width: 42,
  height: 42,
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  color: "#020617",
  fontSize: 18,
  fontWeight: 900,
};

const serviceLabelStyle: CSSProperties = {
  display: "block",
  color: colors.text,
  fontSize: 19,
  fontWeight: 900,
  lineHeight: 1.1,
};

const serviceCopyStyle: CSSProperties = {
  display: "block",
  marginTop: 6,
  color: colors.muted,
  fontSize: 14,
  fontWeight: 650,
};

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
