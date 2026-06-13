import { Composition } from "remotion";
import { LogoAnimation } from "./LogoAnimation";

// 10 seconds at 30 fps = 300 frames, 1280x720 (matches Stage in the design handoff)
export const RemotionRoot = () => {
  return (
    <Composition
      id="LogoAnimation"
      component={LogoAnimation}
      durationInFrames={300}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
