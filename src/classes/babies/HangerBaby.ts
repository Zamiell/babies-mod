import {
  EntityType,
  FamiliarVariant,
  ModCallback,
  ProjectileVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  asNumber,
  onOrAfterRoomFrame,
  spawnProjectile,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Abel; Abel's tears hurt you. */
export class HangerBaby extends Baby {
  @Callback(ModCallback.POST_TEAR_INIT)
  postTearInit(tear: EntityTear): void {
    if (
      tear.SpawnerType !== EntityType.FAMILIAR ||
      tear.SpawnerVariant !== asNumber(FamiliarVariant.ABEL)
    ) {
      return;
    }

    // Abel is spawned on top of the player when the player first enters a room. Don't shoot if this
    // is the case.
    if (onOrAfterRoomFrame(30)) {
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
