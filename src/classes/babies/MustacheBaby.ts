import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** Boomerang tears. */
export class MustacheBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // We can't activate The Boomerang item because there is no way to avoid a long cooldown.
    // Instead, we spawn a boomerang effect.
    tear.Remove();
    spawnEffect(
      EffectVariant.BOOMERANG,
      0,
      tear.Position,
      tear.Velocity,
      tear.SpawnerEntity,
      tear.InitSeed,
    );
  }
}
