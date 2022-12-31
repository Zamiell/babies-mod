import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Removes a heart container on hit. */
export class BuddyBaby extends Baby {
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

    const maxHearts = player.GetMaxHearts();

    if (!g.run.babyBool && maxHearts >= 2) {
      player.AddMaxHearts(-2, true);
      g.run.babyBool = true;
      useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
      g.run.babyBool = false;
      return false;
    }

    return undefined;
  }
}
