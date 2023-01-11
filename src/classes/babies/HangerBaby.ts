import {
  EntityType,
  FamiliarVariant,
  ModCallback,
  ProjectileVariant,
} from "isaac-typescript-definitions";
import { Callback, spawnProjectile } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Abel; Abel's tears hurt you. */
export class HangerBaby extends Baby {
  @Callback(ModCallback.POST_TEAR_INIT)
  postTearInit(tear: EntityTear): void {
    if (
      tear.SpawnerType !== EntityType.FAMILIAR ||
      tear.SpawnerVariant !== (FamiliarVariant.ABEL as int)
    ) {
      return;
    }

    // Abel is spawned on top of the player when the player first enters a room. Don't shoot if this
    // is the case.
    const roomFrameCount = g.r.GetFrameCount();
    if (roomFrameCount >= 30) {
      spawnProjectile(
        ProjectileVariant.NORMAL,
        tear.SubType,
        tear.Position,
        tear.Velocity,
        tear.SpawnerEntity,
        tear.InitSeed,
      );
      tear.Remove();
    }
  }
}
