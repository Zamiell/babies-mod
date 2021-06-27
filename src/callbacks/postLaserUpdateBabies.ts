import g from "../globals";
import { setRandomColor } from "../misc";

const functionMap = new Map<int, (laser: EntityLaser) => void>();
export default functionMap;

// Glass Baby
functionMap.set(14, (laser: EntityLaser) => {
  const data = laser.GetData();
  if (data.ring === true) {
    // Keep the ring centered on the player
    laser.Position = g.p.Position;
  }
});

// Belial Baby
functionMap.set(51, (laser: EntityLaser) => {
  if (
    laser.SpawnerType === EntityType.ENTITY_PLAYER &&
    laser.FrameCount === 0
  ) {
    // Azazel-style Brimstone
    // The formula for distance is: 32 - 2.5 * player.TearHeight
    // (provided by Nine)
    // For simplicity and to make it more difficult,
    // we will instead hard-code the default Azazel distance
    laser.SetMaxDistance(75.125); // This is the vanilla Azazel distance

    // Making the laser invisible earlier also muted the sound effect, so play it manually
    g.sfx.Play(SoundEffect.SOUND_BLOOD_LASER_LARGE, 0.75, 0);
    // (Azazel brimstone is the "large" sound effect instead of the normal one for some reason)
    // (a volume of 1 is a bit too loud)
  }

  if (
    laser.GetSprite().GetFilename() === "gfx/007.001_Thick Red Laser.anm2" &&
    laser.FrameCount === 1
  ) {
    // We made the laser invisible in the PostLaserInit function,
    // and it takes a frame for the "laser.SetMaxDistance()" function to take effect
    laser.Visible = true;
  }
});

// 404 Baby
functionMap.set(463, (laser: EntityLaser) => {
  // This does not work in the PostLaserInit callback for some reason
  if (laser.FrameCount === 0) {
    setRandomColor(laser);
  }
});
