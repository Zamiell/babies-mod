import { setEntityRandomColor } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";

export const postLaserUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (laser: EntityLaser) => void
>();

// 42
postLaserUpdateBabyFunctionMap.set(
  RandomBabyType.COLORFUL,
  (laser: EntityLaser) => {
    // This does not work in the PostLaserInit callback for some reason.
    if (laser.FrameCount === 0) {
      setEntityRandomColor(laser);
    }
  },
);
