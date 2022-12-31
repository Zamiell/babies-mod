import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

/** Spawns a pedestal item after N hits. */
export class SirenShooter extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    }

    return undefined;
  }
}
