import { RandomBabyType } from "../enums/RandomBabyType";

export const postLaserInitBabyFunctionMap = new Map<
  RandomBabyType,
  (laser: EntityLaser) => void
>();

// 51
postLaserInitBabyFunctionMap.set(
  RandomBabyType.BELIAL,
  (laser: EntityLaser) => {
    // Azazel-style Brimstone.
    const sprite = laser.GetSprite();
    const filename = sprite.GetFilename();
    if (filename === "gfx/007.001_Thick Red Laser.anm2") {
      // If we set the distance on frame 0 in the PostLaserUpdate callback, it will look buggy, so
      // manually make it invisible as soon as it spawns, and then we will make it visible later.
      laser.Visible = false;
    }
  },
);
