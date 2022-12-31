import {
  CardType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnCard, VectorZero } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Lovers card on hit. */
export class KindaLovableBaby extends Baby {
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

    spawnCard(CardType.LOVERS, player.Position, VectorZero, player);

    return undefined;
  }
}
