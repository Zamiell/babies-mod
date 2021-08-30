const functionMap = new LuaTable<int, (laser: EntityLaser) => void>();
export default functionMap;

// Belial Baby
functionMap.set(51, (laser: EntityLaser) => {
  if (laser.GetSprite().GetFilename() === "gfx/007.001_Thick Red Laser.anm2") {
    // If we set the distance on frame 0 in the PostLaserUpdate callback, it will look buggy,
    // so manually make it invisible as soon as it spawns, and then we will make it visible later
    laser.Visible = false;
  }
});
