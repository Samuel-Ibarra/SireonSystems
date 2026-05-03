import { Easing } from "remotion";

export const fps = 30;
export const width = 960;
export const height = 720;
export const durationInFrames = 240;

export const colors = {
  ink: "#030712",
  midnight: "#071324",
  panel: "rgba(7, 19, 36, 0.72)",
  panelStrong: "rgba(10, 25, 47, 0.9)",
  line: "rgba(125, 211, 252, 0.2)",
  text: "#F8FAFC",
  muted: "rgba(226, 232, 240, 0.72)",
  cyan: "#00E5FF",
  emerald: "#19F6B1",
  magenta: "#FF3EA5",
  coral: "#FF7A3D",
  violet: "#8B5CF6",
  blue: "#2F80FF",
};

export const fontStack =
  "Sora, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
