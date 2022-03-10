import {
  AZAZEL_DEFAULT_BRIMSTONE_DISTANCE,
  setEntityRandomColor,
  sfxManager,
} from "isaacscript-common";
import g from "../globals";

export const postLaserUpdateBabyFunctionMap = new Map<
  int,
  (laser: EntityLaser) => void
>();

// Glass Baby
postLaserUpdateBabyFunctionMap.set(14, (laser: EntityLaser) => {
  const data = laser.GetData();
  if (data.ring === true) {
    // Keep the ring centered on the player
    laser.Position = g.p.Position;
  }
});

// Colorful Baby
postLaserUpdateBabyFunctionMap.set(42, (laser: EntityLaser) => {
  // This does not work in the PostLaserInit callback for some reason
  if (laser.FrameCount === 0) {
    setEntityRandomColor(laser);
  }
});

// Belial Baby
postLaserUpdateBabyFunctionMap.set(51, (laser: EntityLaser) => {
  const sprite = laser.GetSprite();
  const filename = sprite.GetFilename();

  if (
    laser.SpawnerType === EntityType.ENTITY_PLAYER &&
    laser.FrameCount === 0
  ) {
    // Azazel-style Brimstone
    // For simplicity and to make it more difficult,
    // we will instead hard-code the default Azazel distance
    laser.SetMaxDistance(AZAZEL_DEFAULT_BRIMSTONE_DISTANCE);

    // Making the laser invisible earlier also muted the sound effect, so play it manually
    sfxManager.Play(SoundEffect.SOUND_BLOOD_LASER_LARGE, 0.75);
    // (Azazel brimstone is the "large" sound effect instead of the normal one for some reason)
    // (a volume of 1 is a bit too loud)
  }

  if (
    filename === "gfx/007.001_Thick Red Laser.anm2" &&
    laser.FrameCount === 1
  ) {
    // We made the laser invisible in the PostLaserInit function,
    // and it takes a frame for the "laser.SetMaxDistance()" function to take effect
    laser.Visible = true;
  }
});
