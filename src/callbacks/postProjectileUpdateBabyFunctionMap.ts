import { setEntityRandomColor } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export const postProjectileUpdateBabyFunctionMap = new Map<
  int,
  (projectile: EntityProjectile) => void
>();

// Colorful Baby
postProjectileUpdateBabyFunctionMap.set(42, (projectile: EntityProjectile) => {
  if (projectile.FrameCount === 1) {
    setEntityRandomColor(projectile);
  }
});

// Zombie Baby
postProjectileUpdateBabyFunctionMap.set(61, (projectile: EntityProjectile) => {
  if (
    projectile.Parent !== undefined &&
    projectile.Parent.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)
  ) {
    // Brings back enemies from the dead
    // Make projectiles from friendly enemies faded to prevent confusion
    const color = projectile.GetColor();
    const fadeAmount = 0.25;
    const newColor = Color(color.R, color.G, color.B, fadeAmount);
    // (for some reason, in this callback, RO, GO, and BO will be float values,
    // but the Color constructor only wants integers,
    // so manually use 0 for these 3 values instead of the existing ones)
    projectile.SetColor(newColor, 0, 0, true, true);
  }
});

// Nosferatu Baby
postProjectileUpdateBabyFunctionMap.set(109, (projectile: EntityProjectile) => {
  // Enemies have homing projectiles
  if (
    projectile.SpawnerType !== EntityType.ENTITY_MOMS_HEART && // 78
    projectile.SpawnerType !== EntityType.ENTITY_ISAAC // 102
  ) {
    projectile.AddProjectileFlags(ProjectileFlags.SMART);
  }
});

// Sorrow Baby
postProjectileUpdateBabyFunctionMap.set(153, (projectile: EntityProjectile) => {
  const [, baby] = getCurrentBaby();
  if (baby.distance === undefined) {
    error(`The "distance" attribute was not defined for: ${baby.name}`);
  }

  // Projectiles are reflected as bombs
  if (projectile.Position.Distance(g.p.Position) <= baby.distance) {
    Isaac.Spawn(
      EntityType.ENTITY_BOMB,
      BombVariant.BOMB_NORMAL,
      0,
      projectile.Position,
      projectile.Velocity.mul(-1),
      undefined,
    );
    projectile.Remove();
  }
});

// Onion Baby
postProjectileUpdateBabyFunctionMap.set(224, (projectile: EntityProjectile) => {
  const data = projectile.GetData();
  if (
    data.spedUp === undefined &&
    projectile.SpawnerType !== EntityType.ENTITY_MOMS_HEART && // 78
    projectile.SpawnerType !== EntityType.ENTITY_ISAAC // 102
  ) {
    data.spedUp = true;
    projectile.Velocity = projectile.Velocity.mul(2);
  }
});

// Eye Demon Baby
postProjectileUpdateBabyFunctionMap.set(280, (projectile: EntityProjectile) => {
  const data = projectile.GetData();
  if (data.modified === undefined) {
    data.modified = true;
    projectile.AddProjectileFlags(ProjectileFlags.CONTINUUM);
    projectile.Height *= 2;
  }
});

// Fireball Baby
postProjectileUpdateBabyFunctionMap.set(318, (projectile: EntityProjectile) => {
  // Prevent fires from shooting
  // (this cannot be done in the PostProjectileInit callback since "projectile.SpawnerType" is
  // empty)
  if (
    projectile.FrameCount === 1 &&
    projectile.SpawnerType === EntityType.ENTITY_FIREPLACE
  ) {
    projectile.Remove();
  }
});
