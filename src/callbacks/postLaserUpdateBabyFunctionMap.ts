import { EntityType, SoundEffect } from "isaac-typescript-definitions";
import {
  AZAZEL_DEFAULT_BRIMSTONE_DISTANCE,
  setEntityRandomColor,
  sfxManager,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postLaserUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (laser: EntityLaser) => void
>();

// 14
postLaserUpdateBabyFunctionMap.set(
  RandomBabyType.GLASS,
  (laser: EntityLaser) => {
    const data = laser.GetData();
    if (data["ring"] === true) {
      // Keep the ring centered on the player.
      laser.Position = g.p.Position;
    }
  },
);

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

// 51
postLaserUpdateBabyFunctionMap.set(
  RandomBabyType.BELIAL,
  (laser: EntityLaser) => {
    const sprite = laser.GetSprite();
    const filename = sprite.GetFilename();

    if (laser.SpawnerType === EntityType.PLAYER && laser.FrameCount === 0) {
      // For simplicity and to make it more difficult, we will instead hard-code the default Azazel
      // distance.
      laser.SetMaxDistance(AZAZEL_DEFAULT_BRIMSTONE_DISTANCE);

      // Making the laser invisible earlier also muted the sound effect, so play it manually.
      sfxManager.Play(SoundEffect.BLOOD_LASER_LARGE, 0.75);
      // (The Azazel brimstone is the "large" sound effect instead of the normal one for some
      // reason.) (A volume of 1 is a bit too loud.)
    }

    if (
      filename === "gfx/007.001_Thick Red Laser.anm2" &&
      laser.FrameCount === 1
    ) {
      // We made the laser invisible in the PostLaserInit callback, and it takes a frame for the
      // `EntityLaser.SetMaxDistance` method to take effect.
      laser.Visible = true;
    }
  },
);
