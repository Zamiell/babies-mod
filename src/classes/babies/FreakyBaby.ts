import {
  CollectibleType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, useActiveItemTemp } from "isaacscript-common";
import { Baby } from "../Baby";

/** Converter effect on hit. */
export class FreakyBaby extends Baby {
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

    useActiveItemTemp(player, CollectibleType.CONVERTER);

    return undefined;
  }
}
