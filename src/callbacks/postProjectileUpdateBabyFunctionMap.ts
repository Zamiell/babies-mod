import {
  BombVariant,
  EntityFlag,
  EntityType,
  ProjectileFlag,
} from "isaac-typescript-definitions";
import { setEntityRandomColor, spawnBomb } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getCurrentBabyDescription } from "../utils";

export const postProjectileUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (projectile: EntityProjectile) => void
>();

// 42
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.COLORFUL,
  (projectile: EntityProjectile) => {
    if (projectile.FrameCount === 1) {
      setEntityRandomColor(projectile);
    }
  },
);

// 61
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.ZOMBIE,
  (projectile: EntityProjectile) => {
    if (
      projectile.Parent !== undefined &&
      projectile.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      // Brings back enemies from the dead. Make projectiles from friendly enemies faded to prevent
      // confusion.
      const color = projectile.GetColor();
      const fadeAmount = 0.25;
      const newColor = Color(color.R, color.G, color.B, fadeAmount);
      // (For some reason, in this callback, RO, GO, and BO will be float values, but the Color
      // constructor only wants integers, so we manually use 0 for these 3 values instead of the
      // existing ones.)
      projectile.SetColor(newColor, 0, 0, true, true);
    }
  },
);

// 109
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.NOSFERATU,
  (projectile: EntityProjectile) => {
    // Enemies have homing projectiles.
    if (
      projectile.SpawnerType !== EntityType.MOMS_HEART && // 78
      projectile.SpawnerType !== EntityType.ISAAC // 102
    ) {
      projectile.AddProjectileFlags(ProjectileFlag.SMART);
    }
  },
);

// 153
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.SORROW,
  (projectile: EntityProjectile) => {
    const baby = getCurrentBabyDescription();
    if (baby.distance === undefined) {
      error(`The "distance" attribute was not defined for: ${baby.name}`);
    }

    // Projectiles are reflected as bombs.
    if (projectile.Position.Distance(g.p.Position) <= baby.distance) {
      spawnBomb(
        BombVariant.NORMAL,
        0,
        projectile.Position,
        projectile.Velocity.mul(-1),
      );
      projectile.Remove();
    }
  },
);

// 224
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.ONION,
  (projectile: EntityProjectile) => {
    const data = projectile.GetData();
    if (
      data["spedUp"] === undefined &&
      projectile.SpawnerType !== EntityType.MOMS_HEART && // 78
      projectile.SpawnerType !== EntityType.ISAAC // 102
    ) {
      data["spedUp"] = true;
      projectile.Velocity = projectile.Velocity.mul(2);
    }
  },
);

// 280
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.EYE_DEMON,
  (projectile: EntityProjectile) => {
    const data = projectile.GetData();
    if (data["modified"] === undefined) {
      data["modified"] = true;
      projectile.AddProjectileFlags(ProjectileFlag.CONTINUUM);
      projectile.Height *= 2;
    }
  },
);

// 318
postProjectileUpdateBabyFunctionMap.set(
  RandomBabyType.FIREBALL,
  (projectile: EntityProjectile) => {
    // Prevent fires from shooting. (This cannot be done in the PostProjectileInit callback since
    // "projectile.SpawnerType" is empty.)
    if (
      projectile.FrameCount === 1 &&
      projectile.SpawnerType === EntityType.FIREPLACE
    ) {
      projectile.Remove();
    }
  },
);
