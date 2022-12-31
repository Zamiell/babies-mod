import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { Baby } from "../Baby";

/** My Little Unicorn effect on hit. */
export class SmallFaceBaby extends Baby {
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

    useActiveItemTemp(player, CollectibleType.MY_LITTLE_UNICORN);

    return undefined;
  }
}
