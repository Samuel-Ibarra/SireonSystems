import { Composition, Folder } from "remotion";

import { HeroAutomationLoop } from "./HeroAutomationLoop";
import { ServicesOrbitLoop } from "./ServicesOrbitLoop";
import { durationInFrames, fps, height, width } from "./theme";

export const RemotionRoot = () => {
  return (
    <Folder name="Sireon">
      <Composition
        id="HeroAutomationLoop"
        component={HeroAutomationLoop}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="ServicesOrbitLoop"
        component={ServicesOrbitLoop}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
    </Folder>
  );
};
